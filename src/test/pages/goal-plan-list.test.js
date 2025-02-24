import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import GoalPlansList from "@/app/goal-plans/list/page";
import railsAPI from "@/services/rails-api";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("@/services/rails-api", () => ({
  get: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("GoalPlansList", () => {
  const mockRouterPush = jest.fn();
  const mockSearchParams = {
    get: jest.fn().mockReturnValue(""),
  };

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockRouterPush });
    useSearchParams.mockReturnValue(mockSearchParams);
  });

  it("renders goal plans list page", async () => {
    // Mock API response
    const mockGoalPlans = [
      { id: 1, title: "Morning Routine", purpose: "Start the day fresh", creator: { username: "testuser" } },
      { id: 2, title: "Read a Book", purpose: "Improve knowledge", creator: { username: "testuser" } },
      { id: 3, title: "Workout", purpose: "Stay fit", creator: { username: "testuser" } },
      { id: 4, title: "Stop eating Sugar", purpose: "Stay healthier", creator: { username: "testuser" } },
    ];
    railsAPI.get.mockResolvedValue({ status: 200, data: mockGoalPlans });

    render(<GoalPlansList />);

    // Wait for the API call to complete and the component to re-render
    await waitFor(() => {
      expect(screen.getByText("Morning Routine")).toBeInTheDocument();
      expect(screen.getByText("Read a Book")).toBeInTheDocument();
      expect(screen.getByText("Workout")).toBeInTheDocument();
      expect(screen.getByText("Stop eating Sugar")).toBeInTheDocument();
    });

    // Check if the goal plans are displayed
    expect(screen.getByText("Start the day fresh")).toBeInTheDocument();
    expect(screen.getByText("Improve knowledge")).toBeInTheDocument();
  });

  it("displays an error message if the API call fails", async () => {
    // Mock API error response
    railsAPI.get.mockRejectedValue(new Error("Failed to fetch goal plans data"));

    render(<GoalPlansList />);

    // Wait for the API call to complete and the component to re-render
    await waitFor(() => {
      expect(screen.getByText("Failed to fetch goal plans data")).toBeInTheDocument();
    });
  });

  it("routes to the correct plan page when a GoalPlanCard is clicked", async () => {
    // Mock API response
    const mockGoalPlans = [
      { id: 1, title: "Morning Routine", purpose: "Start the day fresh", creator: { username: "testuser" } },
      { id: 2, title: "Read a Book", purpose: "Improve knowledge", creator: { username: "testuser" } },
    ];
    railsAPI.get.mockResolvedValue({ status: 200, data: mockGoalPlans });

    render(<GoalPlansList />);

    // Wait for the API call to complete and the component to re-render
    await waitFor(() => {
      expect(screen.getByText("Morning Routine")).toBeInTheDocument();
      expect(screen.getByText("Read a Book")).toBeInTheDocument();
    });

    // Click on the first GoalPlanCard
    fireEvent.click(screen.getByText("Morning Routine"));
    expect(mockRouterPush).toHaveBeenCalledWith("/goal-plans/1");

    // Click on the second GoalPlanCard
    fireEvent.click(screen.getByText("Read a Book"));
    expect(mockRouterPush).toHaveBeenCalledWith("/goal-plans/2");
  });
});
