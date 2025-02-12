import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateGoalPage from "@/app/goals/create/page";
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

describe("CreateGoalPage Component", () => {
  let pushMock;

  beforeEach(() => {
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
  });

  it("renders the Create Goal form correctly", async () => {
    getUser.mockResolvedValue({ id: "123" });

    render(<CreateGoalPage />);

    expect(await screen.findByText("Create your goal")).toBeInTheDocument();
    expect(screen.getByLabelText("Title:")).toBeInTheDocument();
    expect(screen.getByLabelText("Purpose:")).toBeInTheDocument();
    expect(screen.getByLabelText("Repeat Term:")).toBeInTheDocument();
    expect(screen.getByLabelText("Time:")).toBeInTheDocument();
    expect(screen.getByLabelText("Set Reminder:")).toBeInTheDocument();
    expect(screen.getByLabelText("Duration:")).toBeInTheDocument();
    expect(screen.getByText("Create Goal")).toBeInTheDocument();
  });

  it("allows user to enter goal details and submit", async () => {
    getUser.mockResolvedValue({ id: "123" });
    railsAPI.post.mockResolvedValue({ status: 201, data: { id: "456" } });

    render(<CreateGoalPage />);

    fireEvent.change(screen.getByLabelText("Title:"), {
      target: { value: "Test Goal" },
    });
    fireEvent.change(screen.getByLabelText("Purpose:"), {
      target: { value: "Test Purpose" },
    });
    fireEvent.click(screen.getByText("Create Goal"));

    await waitFor(() => {
      expect(railsAPI.post).toHaveBeenCalledWith(
        "/goals",
        expect.objectContaining({
          goal: expect.objectContaining({
            title: "Test Goal",
            purpose: "Test Purpose",
          }),
        })
      );
      expect(pushMock).toHaveBeenCalledWith("/goals/456");
    });
  });

  it("validates required inputs and displays error messages", async () => {
    getUser.mockResolvedValue({ id: "123" });

    render(<CreateGoalPage />);

    fireEvent.click(screen.getByText("Create Goal"));

    await waitFor(() => {
      expect(screen.getByText("Title is required.")).toBeInTheDocument();
      expect(screen.getByText("Purpose is required.")).toBeInTheDocument();
    });
  });

  it("minutes selector should be displayed", async () => {
    getUser.mockResolvedValue({ id: "123" });

    render(<CreateGoalPage />);

    await waitFor(() => {
      expect(screen.getByText("At time of event")).toBeInTheDocument();
    });
  });

  it("hide the minutes selector when the Set Reminder switch is clicked", async () => {
    getUser.mockResolvedValue({ id: "123" });

    render(<CreateGoalPage />);

    const reminderSwitch = screen.queryByRole("switch");
    fireEvent.click(reminderSwitch);

    await waitFor(() => {
      expect(screen.queryByText("At time of event")).not.toBeInTheDocument();
    });
  });

  it("shows an error when specific duration is selected but missing details", async () => {
    getUser.mockResolvedValue({ id: "123" });

    render(<CreateGoalPage />);

    fireEvent.change(screen.getByLabelText("Title:"), {
      target: { value: "Test Goal" },
    });
    fireEvent.change(screen.getByLabelText("Purpose:"), {
      target: { value: "Test Purpose" },
    });
    fireEvent.change(screen.getByLabelText("Repeat Term:"), {
      target: { value: "weekly" },
    });
    fireEvent.change(screen.getByLabelText("Time:"), {
      target: { value: "14:00" },
    });
    fireEvent.change(screen.getByLabelText("Duration:"), {
      target: { value: "specific_duration" },
    });

    fireEvent.change(screen.getByTestId("duration_length"), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByTestId("duration_measure"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("Create Goal"));

    await waitFor(() => {
      expect(
        screen.getByText("Duration length is required.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Duration measure is required.")
      ).toBeInTheDocument();
    });
  });

  it("shows an error notification if goal creation fails", async () => {
    getUser.mockResolvedValue({ id: "123" });
    railsAPI.post.mockRejectedValue(new Error("Failed to create goal"));

    render(<CreateGoalPage />);

    fireEvent.change(screen.getByLabelText("Title:"), {
      target: { value: "Test Goal" },
    });
    fireEvent.change(screen.getByLabelText("Purpose:"), {
      target: { value: "Test Purpose" },
    });
    fireEvent.click(screen.getByText("Create Goal"));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to create goal. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("logs out and redirects to login if fetching user data fails", async () => {
    getUser.mockRejectedValue(new Error("User fetch failed"));
    logout.mockImplementation((callback) => callback());

    render(<CreateGoalPage />);

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });
});
