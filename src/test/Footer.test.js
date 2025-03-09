import { render, screen } from "@testing-library/react";
import Footer from "@/app/components/Footer";
import { useUser } from "@/app/context/UserProvider";

jest.mock("@/app/context/UserProvider", () => ({
  useUser: jest.fn(),
}));

describe("Footer", () => {
  it("renders the Footer without crashing when user is logged out", () => {
    // Mock useUser to simulate user being logged out (user is null)
    useUser.mockReturnValue({ user: null, isLoading: false });

    render(<Footer />);

    // Expect the links to be present
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact us")).toBeInTheDocument();
  });

  it("renders the Footer without crashing when user is logged in", () => {
    // Mock useUser to simulate user being logged in (user is not null)
    useUser.mockReturnValue({ user: { name: "John" }, isLoading: false });

    render(<Footer />);

    // Expect the links to be present
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact us")).toBeInTheDocument();
  });

  it("displays the logo", () => {
    useUser.mockReturnValue({ user: null, isLoading: false });

    render(<Footer />);
    expect(screen.getByAltText("WillBee Footer Logo")).toBeInTheDocument();
  });

  it('contains "About" and "Contact us" as hyperlinks', () => {
    useUser.mockReturnValue({ user: null, isLoading: false });
    render(<Footer />);
    const aboutLink = screen.getByText("About");
    const contactLink = screen.getByText("Contact us");

    // Check if the links link to correct page.
    expect(aboutLink.closest("a")).toHaveAttribute("href", "#");
    expect(contactLink.closest("a")).toHaveAttribute("href", "#");
  });

  it("displays the correct copyrights text with the current year", () => {
    useUser.mockReturnValue({ user: null, isLoading: false });
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} WillBee. All rights reserved.`)
    ).toBeInTheDocument();
  });
});
