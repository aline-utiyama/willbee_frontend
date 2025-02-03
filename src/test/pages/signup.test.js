import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "@/app/signup/page";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";
import { logout } from "@/app/actions/auth";
import railsAPI from "@/services/rails-api";

// Mock Next.js hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock services
jest.mock("@/services/rails-api", () => ({
  post: jest.fn(),
}));

jest.mock("@/app/actions/auth", () => ({
  login: jest.fn(),
  logout: jest.fn(),
}));

describe("Signup Component", () => {
  let pushMock;

  beforeEach(() => {
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
  });

  it("renders the Signup form correctly", async () => {
    render(<Signup />);

    expect(await screen.findByText("Create your account")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Surname")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("allows user to fill out the form and submit", async () => {
    railsAPI.post.mockResolvedValue({ status: 201 });
    // Mock the login function to resolve immediately, triggering the push to /dashboard
    login.mockImplementation((data, onSuccess, onError) => {
      onSuccess(); // Call the success callback
    });

    render(<Signup />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText("Surname"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "johndoe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText("Sign up"));
    });

    await waitFor(() => {
      expect(railsAPI.post).toHaveBeenCalledWith(
        "/users",
        expect.objectContaining({
          user: expect.objectContaining({
            name: "John",
            surname: "Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
            password_confirmation: "password123",
          }),
        })
      );

      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("validates required inputs and displays error messages", async () => {
    render(<Signup />);

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "pass" },
      });

      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "1234" },
      });
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText("Sign up"));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters long.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Surname must be at least 2 characters long.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Username must be at least 2 characters long.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Password must be at least 6 characters long.")
      ).toBeInTheDocument();
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      expect(screen.getByText("Passwords do not match!")).toBeInTheDocument();
    });
  });

  it("shows an error if the username is already taken", async () => {
    railsAPI.post.mockRejectedValue({
      response: { data: { errors: ["Username has already been taken"] } },
    });

    render(<Signup />);

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText("Name"), {
        target: { value: "John" },
      });
      fireEvent.change(screen.getByLabelText("Surname"), {
        target: { value: "Doe" },
      });
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "takenusername" },
      });
      fireEvent.change(screen.getByLabelText("Email address"), {
        target: { value: "johndoe@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "password123" },
      });
    });

    fireEvent.click(screen.getByText("Sign up"));

    await waitFor(() => {
      expect(
        screen.getByText("The username is already taken.")
      ).toBeInTheDocument();
    });
  });

  it("shows an error if the email is already taken", async () => {
    railsAPI.post.mockRejectedValue({
      response: { data: { errors: ["Email has already been taken"] } },
    });

    render(<Signup />);

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText("Name"), {
        target: { value: "John" },
      });
      fireEvent.change(screen.getByLabelText("Surname"), {
        target: { value: "Doe" },
      });
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "johndoe" },
      });
      fireEvent.change(screen.getByLabelText("Email address"), {
        target: { value: "takenemail@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "password123" },
      });
    });

    fireEvent.click(screen.getByText("Sign up"));

    await waitFor(() => {
      expect(
        screen.getByText("Email has already been taken.")
      ).toBeInTheDocument();
    });
  });

  it("shows a general error message if the signup fails", async () => {
    railsAPI.post.mockRejectedValue({
      response: { data: { errors: ["Failed to create user"] } },
    });

    render(<Signup />);

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText("Name"), {
        target: { value: "John" },
      });
      fireEvent.change(screen.getByLabelText("Surname"), {
        target: { value: "Doe" },
      });
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "johndoe2" },
      });
      fireEvent.change(screen.getByLabelText("Email address"), {
        target: { value: "johndoe2@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "password123" },
      });
    });

    fireEvent.click(screen.getByText("Sign up"));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to create user. Please try again later.")
      ).toBeInTheDocument();
    });
  });

  it("redirects to login page if an error occurs during signup", async () => {
    railsAPI.post.mockRejectedValue(new Error("Signup error"));
    login.mockImplementation((data, onSuccess, onError) => {
      onError(); // Call the error callback
    });

    render(<Signup />);

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText("Name"), {
        target: { value: "John" },
      });
      fireEvent.change(screen.getByLabelText("Surname"), {
        target: { value: "Doe" },
      });
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "johndoe2" },
      });
      fireEvent.change(screen.getByLabelText("Email address"), {
        target: { value: "johndoe2@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "password123" },
      });
    });

    fireEvent.click(screen.getByText("Sign up"));

    await waitFor(() => {
      expect(login).toHaveBeenCalled();
      expect(
        screen.getByText("Failed to create user. Please try again later.")
      ).toBeInTheDocument();
    });
  });
});
