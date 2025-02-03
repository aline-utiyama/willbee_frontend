import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/app/login/page";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/actions/auth", () => ({
  login: jest.fn(),
}));

describe("Login Component", () => {
  let pushMock;

  beforeEach(() => {
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
  });

  it("renders login form correctly", () => {
    render(<Login />);

    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("allows user to fill out the form and submit", async () => {
    login.mockImplementation((data, onSuccess, onError) => {
      onSuccess();
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "johndoe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(
        { email: "johndoe@example.com", password: "password123" },
        expect.any(Function),
        expect.any(Function)
      );
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays error message on failed login", async () => {
    login.mockImplementation((data, onSuccess, onError) => {
      onError("Invalid email or password");
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });
});
