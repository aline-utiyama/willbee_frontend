import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GoalPlansCreatePage from "@/app/goal-plans/create/page";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { getUser } from "@/app/actions/user";
import railsAPI from "@/services/rails-api";

// Mock Next.js hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/actions/auth", () => ({
  logout: jest.fn(),
}));

jest.mock("@/app/actions/user", () => ({
  getUser: jest.fn(),
}));

jest.mock("@/services/rails-api", () => ({
  post: jest.fn(),
}));

describe("GoalPlansCreatePage Component", () => {
  let pushMock;

  beforeEach(() => {
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
  });

  it("renders the Create Goal Plan form correctly", async () => {
    getUser.mockResolvedValue({ id: "123" });

    render(<GoalPlansCreatePage />);

    expect(await screen.findByText("Create a Goal Plan")).toBeInTheDocument();
    expect(screen.getByLabelText("Title:")).toBeInTheDocument();
    expect(screen.getByLabelText("Purpose:")).toBeInTheDocument();
    expect(screen.getByLabelText("Advice:")).toBeInTheDocument();
    expect(screen.getByLabelText("Repeat Term:")).toBeInTheDocument();
    expect(screen.getByLabelText("Time:")).toBeInTheDocument();
    expect(screen.getByLabelText("Duration:")).toBeInTheDocument();
    expect(screen.getByText("Create Goal Plan")).toBeInTheDocument();
  });

  it("allows user to enter goal plan details and submit", async () => {
    getUser.mockResolvedValue({ id: "123" });
    railsAPI.post.mockResolvedValue({ status: 201, data: { id: "456" } });

    render(<GoalPlansCreatePage />);

    fireEvent.change(screen.getByLabelText("Title:"), {
      target: { value: "Test Goal Plan" },
    });
    fireEvent.change(screen.getByLabelText("Purpose:"), {
      target: { value: "Test Purpose" },
    });
    fireEvent.click(screen.getByText("Create Goal Plan"));

    await waitFor(() => {
      expect(railsAPI.post).toHaveBeenCalledWith(
        "/goal_plans",
        expect.objectContaining({
          goal_plan: expect.objectContaining({
            title: "Test Goal Plan",
            purpose: "Test Purpose",
          }),
        })
      );
      expect(pushMock).toHaveBeenCalledWith("/goal-plans/456");
    });
  });

  it("validates required inputs and displays error messages", async () => {
    getUser.mockResolvedValue({ id: "123" });

    render(<GoalPlansCreatePage />);
    fireEvent.click(screen.getByText("Create Goal Plan"));

    await waitFor(() => {
      expect(screen.getByText("Title is required.")).toBeInTheDocument();
      expect(screen.getByText("Purpose is required.")).toBeInTheDocument();
    });
  });

  it("shows an error when specific duration is selected but missing details", async () => {
    getUser.mockResolvedValue({ id: "123" });

    render(<GoalPlansCreatePage />);

    fireEvent.change(screen.getByLabelText("Duration:"), {
      target: { value: "specific_duration" },
    });
    fireEvent.change(screen.getByTestId("duration_length"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByTestId("duration_measure"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByText("Create Goal Plan"));

    await waitFor(() => {
      expect(
        screen.getByText("Duration length is required.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Duration measure is required.")
      ).toBeInTheDocument();
    });
  });

  it("shows an error notification if goal plan creation fails", async () => {
    getUser.mockResolvedValue({ id: "123" });
    railsAPI.post.mockRejectedValue(new Error("Failed to create goal plan"));

    render(<GoalPlansCreatePage />);

    fireEvent.change(screen.getByLabelText("Title:"), {
      target: { value: "Test Goal Plan" },
    });
    fireEvent.change(screen.getByLabelText("Purpose:"), {
      target: { value: "Test Purpose" },
    });
    fireEvent.click(screen.getByText("Create Goal Plan"));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to create goal plan. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("logs out and redirects to login if fetching user data fails", async () => {
    getUser.mockRejectedValue(new Error("User fetch failed"));
    logout.mockImplementation((callback) => callback());

    render(<GoalPlansCreatePage />);

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });
});
