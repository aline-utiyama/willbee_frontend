import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/app/components/Navbar";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";

// Mock Next.js hooks
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("@/app/actions/auth", () => ({
  logout: jest.fn(),
}));

describe("Navbar Component", () => {
  it("renders the Navbar with login/signup buttons when on the homepage", () => {
    usePathname.mockReturnValue("/");

    render(<Navbar />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Signup")).toBeInTheDocument();
  });

  it("renders the Navbar with profile and logout button when logged in", () => {
    usePathname.mockReturnValue("/dashboard");

    render(<Navbar />);

    expect(screen.getByText("View notifications")).toBeInTheDocument();
    expect(screen.getByText("Open user menu")).toBeInTheDocument();

    const userMenu = screen.getByText("Open user menu");
    fireEvent.click(userMenu);

    expect(screen.getByText("Your Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("calls the logout function and redirects to login when logout is clicked", () => {
    const pushMock = jest.fn(); // Create a mock function for push
    useRouter.mockReturnValue({ push: pushMock }); // Mock useRouter with our mock function
    usePathname.mockReturnValue("/dashboard");

    // Mock logout to call the callback
    logout.mockImplementation((callback) => {
      callback(); // Simulate callback call after logout
    });

    render(<Navbar />);

    const userMenu = screen.getByText("Open user menu");
    fireEvent.click(userMenu);

    const logoutButton = screen.getByText("Sign out");
    fireEvent.click(logoutButton);

    expect(logout).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/login");
  });
});
