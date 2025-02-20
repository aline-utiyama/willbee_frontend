import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "@/app/dashboard/page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Dashboard", () => {
  let pushMock;

  beforeEach(() => {
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
  });

  it("renders category names and images", () => {
    render(<Dashboard />);

    const categories = [
      "Customized Goal",
      "AI Goal Builder",
      "Fitness",
      "Health",
      "Music",
      "Personal Growth",
      "Career",
      "Reading",
      "Sports",
    ];

    categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
      expect(screen.getByAltText(category)).toBeInTheDocument();
    });
  });

  it("navigates to the correct page when a category is clicked", () => {
    render(<Dashboard />);

    fireEvent.click(screen.getByText("Customized Goal"));
    expect(pushMock).toHaveBeenCalledWith("/goals/create");

    fireEvent.click(screen.getByText("AI Goal Builder"));
    expect(pushMock).toHaveBeenCalledWith("/goals/create-with-ai");
  });
});
