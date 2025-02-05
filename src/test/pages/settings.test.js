import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SettingsPage from "@/app/settings/page";
import railsAPI from "@/services/rails-api";
import { getUser } from "@/app/actions/user";
import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

jest.mock("@/app/actions/user", () => ({ getUser: jest.fn() }));
jest.mock("@/app/actions/auth", () => ({ logout: jest.fn() }));
jest.mock("@/services/rails-api", () => ({ put: jest.fn() }));
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));

describe("SettingsPage", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockRouterPush });
  });

  it("renders the settings form", async () => {
    getUser.mockResolvedValue({
      id: "1",
      name: "John",
      surname: "Doe",
      username: "johndoe",
      email: "johndoe@example.com",
    });

    render(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveValue("John");
      expect(screen.getByLabelText("Surname")).toHaveValue("Doe");
      expect(screen.getByLabelText("Username")).toHaveValue("johndoe");
      expect(screen.getByLabelText("Email address")).toHaveValue(
        "johndoe@example.com"
      );
    });
  });

  it("updates user information successfully", async () => {
    getUser.mockResolvedValue({
      id: "1",
      name: "John",
      surname: "Doe",
      username: "johndoe",
      email: "johndoe@example.com",
    });
    railsAPI.put.mockResolvedValue({ status: 200 });

    render(<SettingsPage />);

    // Wait for initial user data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    });

    // Update the form
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText("Surname"), {
      target: { value: "Smith" },
    });

    // Verify inputs updated
    expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Smith")).toBeInTheDocument();

    await waitFor(() => {
      fireEvent.click(screen.getByText("Update"));
    });

    await waitFor(() => {
      expect(railsAPI.put).toHaveBeenCalledWith(
        "/users/1",
        expect.objectContaining({
          user: expect.objectContaining({
            name: "Jane",
            surname: "Smith",
            username: "johndoe",
            email: "johndoe@example.com",
          }),
        })
      );

      expect(screen.getByText("Successfully updated!")).toBeInTheDocument();
    });
  });

  it("shows validation errors if fields are invalid", async () => {
    render(<SettingsPage />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Surname"), {
      target: { value: "A" },
    });
    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters long.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Surname must be at least 2 characters long.")
      ).toBeInTheDocument();
    });
  });

  it("shows an error message if the update fails", async () => {
    getUser.mockResolvedValue({
      id: "1",
      name: "John",
      surname: "Doe",
      username: "johndoe",
      email: "johndoe@example.com",
    });
    railsAPI.put.mockRejectedValue(new Error("Update failed"));
    render(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveValue("John");
      expect(screen.getByLabelText("Surname")).toHaveValue("Doe");
      expect(screen.getByLabelText("Username")).toHaveValue("johndoe");
      expect(screen.getByLabelText("Email address")).toHaveValue(
        "johndoe@example.com"
      );
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText("Update"));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Failed to update user. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("logs out and redirects to login if fetching user data fails", async () => {
    getUser.mockRejectedValue(new Error("User fetch failed"));
    logout.mockImplementation((callback) => callback());

    render(<SettingsPage />);

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith("/login");
    });
  });
});
