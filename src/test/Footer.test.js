import { render, screen } from "@testing-library/react";
import Footer from "@/app/components/Footer";

describe("Footer", () => {
  it("renders the Footer without crashing", () => {
    render(<Footer />);
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact us")).toBeInTheDocument();
  });

  it("displays the logo", () => {
    render(<Footer />);
    expect(screen.getByAltText("WillBee Footer Logo")).toBeInTheDocument();
  });

  it('contains "About" and "Contact us" as hyperlinks', () => {
    render(<Footer />);
    const aboutLink = screen.getByText("About");
    const contactLink = screen.getByText("Contact us");

    // Check if the links link to correct page.
    // TODO: currently no path in the links
    expect(aboutLink.closest("a")).toHaveAttribute("href", "#");
    expect(contactLink.closest("a")).toHaveAttribute("href", "#");
  });

  it("displays the correct copyrights text with the current year", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} WillBee. All rights reserved.`)).toBeInTheDocument();
  });
});
