import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GoalPlanPage from "@/app/goal-plans/[id]/page";
import railsAPI from "@/services/rails-api";
import { useRouter, useParams } from "next/navigation";
import { getUser } from "@/app/actions/user";

jest.mock("@/services/rails-api", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/app/actions/user", () => ({
  getUser: jest.fn(),
}));

describe("GoalPlanPage", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockRouterPush });
    useParams.mockReturnValue({ id: "1" });
  });

  it("renders goal plan details", async () => {
    railsAPI.get.mockResolvedValue({
      status: 200,
      data: {
        title: "Master Japanese",
        purpose: "Work in Japan",
        advice: "Study daily",
        creator: { username: "Admin" },
        repeat_term: "daily",
        duration: "specific_duration",
        duration_length: 30,
        duration_measure: "minutes",
      },
    });

    render(<GoalPlanPage />);

    await waitFor(() => {
      const elements = screen.getAllByText("Master Japanese");
      expect(elements.length).toBeGreaterThan(1);
      expect(screen.getByText("Work in Japan")).toBeInTheDocument();
      expect(screen.getByText("Study daily")).toBeInTheDocument();
    });
  });

  it("handles goal creation successfully", async () => {
    railsAPI.get.mockResolvedValue({
      status: 200,
      data: {
        title: "Master Japanese",
        purpose: "Work in Japan",
        advice: "Study daily",
        creator: { username: "Admin" },
        repeat_term: "daily",
        duration: "specific_duration",
        duration_length: 30,
        duration_measure: "minutes",
      },
    });
    // Mock user retrieval
    getUser.mockResolvedValue({ id: "123" });

    // Mock API response for goal creation
    railsAPI.post.mockResolvedValue({
      status: 201,
      data: { id: "2" },
    });

    render(<GoalPlanPage />);

    await waitFor(() => {
      const elements = screen.getAllByText("Master Japanese");
      expect(elements.length).toBeGreaterThan(1);
      expect(screen.getByText("Work in Japan")).toBeInTheDocument();
      expect(screen.getByText("Study daily")).toBeInTheDocument();
    });

    // Wait for the Goal Plan data to be displayed before proceeding
    await waitFor(() => {
      expect(screen.getByText("Create Goal")).toBeInTheDocument();
    });

    const button = screen.getByText("Create Goal");
    fireEvent.click(button);

    //Ensure the API was called with the correct endpoint and payload
    await waitFor(() => {
      expect(railsAPI.post).toHaveBeenCalledTimes(1);
      expect(railsAPI.post).toHaveBeenCalledWith("/goals", expect.any(Object));
    });

    // Verify navigation to the newly created goal page
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/goals/2");
    });
  });

  it("displays an error notification when goal creation fails", async () => {
    railsAPI.get.mockResolvedValue({
      status: 200,
      data: {
        title: "Master Japanese",
        purpose: "Work in Japan",
        advice: "Study daily",
        creator: { username: "Admin" },
        repeat_term: "daily",
        duration: "specific_duration",
        duration_length: 30,
        duration_measure: "minutes",
      },
    });

    // Mock user retrieval
    getUser.mockResolvedValue({ id: "123" });

    // Mock API response for goal creation
    railsAPI.post.mockRejectedValue(new Error("API Error"));

    render(<GoalPlanPage />);

    await waitFor(() => {
      expect(screen.getByText("Create Goal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Create Goal"));

    await waitFor(() => {
      expect(railsAPI.post).toHaveBeenCalledWith("/goals", expect.any(Object));
      expect(
        screen.getByText("Failed to create goal. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("shows an error message when API request fails", async () => {
    railsAPI.get.mockRejectedValue({ status: 500 });

    render(<GoalPlanPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("redirects to 404 when goal plan is not found", async () => {
    railsAPI.get.mockRejectedValue({ status: 404 });

    render(<GoalPlanPage />);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/404");
    });
  });
});
