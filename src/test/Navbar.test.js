import { render, screen, fireEvent, act } from "@testing-library/react";
import Navbar from "@/app/components/Navbar";
import { usePathname, useRouter } from "next/navigation";
import { useNotifications } from "@/app/context/NotificationProvider";
import { logout } from "@/app/actions/auth";
import { useUser } from "@/app/context/UserProvider";

// Mock Next.js hooks
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("@/app/actions/auth", () => ({
  logout: jest.fn(),
}));

jest.mock("@/app/context/NotificationProvider", () => ({
  useNotifications: jest.fn(),
}));

jest.mock("@/app/context/UserProvider", () => ({
  useUser: jest.fn(),
}));

beforeEach(() => {
  useUser.mockReturnValue({
    user: null,
  });
});

describe("Navbar Component", () => {
  it("renders the Navbar with login/signup buttons when on the homepage", () => {
    usePathname.mockReturnValue("/");

    render(<Navbar />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Signup")).toBeInTheDocument();
  });

  it("renders the Navbar with profile and logout button when logged in", () => {
    usePathname.mockReturnValue("/dashboard");

    // Mock notifications
    useNotifications.mockReturnValue({
      notifications: [
        { id: 1, seen: false },
        { id: 2, seen: true },
      ],
      removeNotification: jest.fn(),
      markNotificationAsRead: jest.fn(),
    });

    render(<Navbar />);

    expect(screen.getByText("View notifications")).toBeInTheDocument();
    expect(screen.getByText("Open user menu")).toBeInTheDocument();

    const userMenu = screen.getByText("Open user menu");
    fireEvent.click(userMenu);

    const homeElements = screen.getAllByText("Home");
    expect(homeElements).toHaveLength(2);

    const myGoalsElements = screen.getAllByText("My Goals");
    expect(myGoalsElements).toHaveLength(2);

    expect(screen.getByText("Goal Plans")).toBeInTheDocument();
    expect(screen.getByText("User Settings")).toBeInTheDocument();
    expect(screen.getByText("WillBlog")).toBeInTheDocument();
    expect(screen.getByText("Help & Support")).toBeInTheDocument();
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

  it("routes to the correct pages when dropdown menu items are clicked", () => {
    const pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
    usePathname.mockReturnValue("/dashboard");

    render(<Navbar />);

    const userMenu = screen.getByText("Open user menu");
    fireEvent.click(userMenu);

    const homeElements = screen.getAllByText("Home");
    expect(homeElements).toHaveLength(2);

    const myGoalsElements = screen.getAllByText("My Goals");
    expect(myGoalsElements).toHaveLength(2);

    const menuItems = [
      { text: "Goal Plans", href: "/goal-plans/list" },
      { text: "User Settings", href: "/settings" },
      { text: "WillBlog", href: "#" },
      { text: "Help & Support", href: "#" },
    ];

    menuItems.forEach((item) => {
      const menuItem = screen.getByText(item.text);
      fireEvent.click(menuItem);
      expect(pushMock).toHaveBeenCalledWith(item.href);
      pushMock.mockClear(); // Clear the mock after each click to ensure each call is tested separately
    });
  });
});
