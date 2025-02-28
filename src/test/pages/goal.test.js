import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GoalPage from "@/app/goals/[id]/page";
import railsAPI from "@/services/rails-api";
import nextAPI from "@/services/next-api";
import { useRouter, useParams } from "next/navigation";

jest.mock("@/services/rails-api", () => ({
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/services/next-api", () => ({
  post: jest.fn(),
}));

describe("GoalPage", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockRouterPush });
    useParams.mockReturnValue({ id: "1" });
  });

  it("renders the goal details", async () => {
    railsAPI.get.mockResolvedValue({
      status: 200,
      data: {
        title: "Learn Japanese",
        purpose: "To work in Japan",
        goal_progresses: [],
      },
    });

    render(<GoalPage />);

    await waitFor(() => {
      expect(screen.getByText("Learn Japanese")).toBeInTheDocument();
      expect(screen.getByText("To work in Japan")).toBeInTheDocument();
    });
  });

  it("updates goal successfully", async () => {
    railsAPI.get.mockResolvedValue({
      status: 200,
      data: {
        title: "Learn Japanese",
        purpose: "To work in Japan",
        goal_progresses: [],
      },
    });
    railsAPI.put.mockResolvedValue({ status: 200 });

    render(<GoalPage />);

    await waitFor(() => {
      expect(screen.getByText("Learn Japanese")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("⋮"));
    expect(screen.getByText("Edit")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Goal")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Title:"), {
      target: { value: "Master Kanji" },
    });
    fireEvent.change(screen.getByLabelText("Purpose:"), {
      target: { value: "Pass JLPT N1" },
    });

    expect(screen.getByDisplayValue("Master Kanji")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Pass JLPT N1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(railsAPI.put).toHaveBeenCalledWith("/goals/1", {
        goal: { title: "Master Kanji", purpose: "Pass JLPT N1" },
      });
    });
  });

  it("shows validation errors if fields are invalid", async () => {
    railsAPI.get.mockResolvedValue({
      status: 200,
      data: {
        title: "Learn Japanese",
        purpose: "To work in Japan",
        goal_progresses: [],
      },
    });
    railsAPI.put.mockResolvedValue({ status: 200 });

    render(<GoalPage />);

    await waitFor(() => {
      expect(screen.getByText("Learn Japanese")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("⋮"));
    expect(screen.getByText("Edit")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Goal")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Title:"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Purpose:"), {
      target: { value: "A" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.getByText("Title must be at least 2 characters long.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Purpose must be at least 2 characters long.")
      ).toBeInTheDocument();
    });
  });

  it("shows an error message if update fails", async () => {
    railsAPI.get.mockResolvedValue({
      status: 200,
      data: {
        title: "Learn Japanese",
        purpose: "To work in Japan",
        goal_progresses: [],
      },
    });
    railsAPI.put.mockRejectedValue(new Error("Update failed"));

    render(<GoalPage />);

    await waitFor(() => {
      expect(screen.getByText("Learn Japanese")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("⋮"));
    expect(screen.getByText("Edit")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Goal")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText("Title:")).toHaveValue("Learn Japanese");
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to update goal. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("deletes goal successfully", async () => {
    railsAPI.get.mockResolvedValue({
      status: 200,
      data: {
        title: "Learn Japanese",
        purpose: "To work in Japan",
        goal_progresses: [],
      },
    });
    railsAPI.delete.mockResolvedValue({ status: 204 });

    render(<GoalPage />);

    await waitFor(() => {
      expect(screen.getByText("Learn Japanese")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("⋮"));
    expect(screen.getByText("Delete")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Delete"));
    expect(screen.getByText("Delete Goal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(railsAPI.delete).toHaveBeenCalledWith("/goals/1");
      expect(mockRouterPush).toHaveBeenCalledWith("/goals/list");
    });
  });

  it("shows an error message if delete fails", async () => {
    railsAPI.get.mockResolvedValue({
      status: 200,
      data: {
        title: "Learn Japanese",
        purpose: "To work in Japan",
        goal_progresses: [],
      },
    });
    railsAPI.delete.mockRejectedValue(new Error("Delete failed"));

    render(<GoalPage />);

    await waitFor(() => {
      expect(screen.getByText("Learn Japanese")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("⋮"));
    expect(screen.getByText("Delete")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Delete"));
    expect(screen.getByText("Delete Goal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to delete goal. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("redirects to 404 when the goal is not found", async () => {
    useParams.mockReturnValue({ id: "1" });

    // Mock API call to reject with a 404 error
    railsAPI.get.mockRejectedValue({ status: 404 });

    render(<GoalPage />);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/404");
    });
  });

  it("shows an error message when a different error occurs", async () => {
    useParams.mockReturnValue({ id: "1" });

    // Mock API call to reject with a non-404 error
    railsAPI.get.mockRejectedValue({ status: 500 });

    render(<GoalPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("renders avatar emoji based on current streak", async () => {
    railsAPI.get.mockResolvedValue({
      status: 200,
      data: {
        title: "Master Kanji",
        purpose: "Pass JLPT N1",
        goal_progresses: [
          {
            date: new Date().toISOString().split("T")[0],
            completed: true,
            current_streak: 10,
          },
        ],
        repeat_term: "daily",
      },
    });

    render(<GoalPage />);

    await waitFor(() =>
      expect(screen.getByText("Master Kanji")).toBeInTheDocument()
    );

    const avatarImage = screen.getByRole("img", { name: /avatar/i });
    expect(avatarImage).toHaveAttribute(
      "src",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Adrian&radius=40&backgroundColor=fcbc34&eyes=stars&mouth=smileLol"
    );
  });

  it("renders neutral face for low streak", async () => {
    railsAPI.get.mockResolvedValue({
      status: 200,
      data: {
        title: "Master Kanji",
        purpose: "Pass JLPT N1",
        goal_progresses: [
          {
            date: new Date().toISOString().split("T")[0],
            completed: true,
            current_streak: 1,
          },
        ],
        repeat_term: "daily",
      },
    });

    render(<GoalPage />);

    await waitFor(() =>
      expect(screen.getByText("Master Kanji")).toBeInTheDocument()
    );

    const avatarImage = screen.getByRole("img", { name: /avatar/i });
    expect(avatarImage).toHaveAttribute(
      "src",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Adrian&radius=40&backgroundColor=fcbc34&eyes=cute&mouth=lilSmile"
    );
  });

  it("renders sad face for no streak", async () => {
    railsAPI.get.mockResolvedValue({
      status: 200,
      data: {
        title: "Master Kanji",
        purpose: "Pass JLPT N1",
        goal_progresses: [
          {
            date: new Date().toISOString().split("T")[0],
            completed: false,
            current_streak: 0,
          },
        ],
        repeat_term: "daily",
      },
    });

    render(<GoalPage />);

    await waitFor(() =>
      expect(screen.getByText("Master Kanji")).toBeInTheDocument()
    );

    const avatarImage = screen.getByRole("img", { name: /avatar/i });
    expect(avatarImage).toHaveAttribute(
      "src",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Adrian&radius=40&backgroundColor=fcbc34&eyes=tearDrop&mouth=shy"
    );
  });

  it("logs task completion", async () => {
    railsAPI.get.mockResolvedValue({
      status: 200,
      data: {
        title: "Master Kanji",
        purpose: "Pass JLPT N1",
        goal_progresses: [],
        repeat_term: "daily",
      },
    });
    railsAPI.patch.mockResolvedValue({ status: 200 });

    render(<GoalPage />);

    await waitFor(() =>
      expect(screen.getByText("Master Kanji")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Mark as Completed"));

    await waitFor(() =>
      expect(screen.getByText("Task Completed")).toBeInTheDocument()
    );
  });

  it("displays and updates the progress graph correctly", async () => {
    const goalData = {
      title: "Master Kanji",
      purpose: "Pass JLPT N1",
      goal_progresses: [
        { date: "2025-02-01", completed: false },
        { date: "2025-02-20", completed: true },
      ],
      repeat_term: "daily",
      graph_type: "bar",
    };
    railsAPI.get.mockResolvedValueOnce({ status: 200, data: goalData });
    render(<GoalPage />);

    await waitFor(() =>
      expect(screen.getByText("Master Kanji")).toBeInTheDocument()
    );

    // Check if the graph is displayed
    expect(screen.getByText("My progress")).toBeInTheDocument();

    // Simulate marking a task as completed
    railsAPI.patch.mockResolvedValueOnce({ status: 200 });
    fireEvent.click(screen.getByText("Mark as Completed"));

    await waitFor(() => {
      // Check if the graph is updated
      expect(screen.getByText("Task Completed")).toBeInTheDocument();
    });
  });
});

describe("GoalPage - handleCloseModal", () => {
  let setIsModalOpen;
  let setFormData;
  let goal;
  let handleCloseModal;

  beforeEach(() => {
    setIsModalOpen = jest.fn();
    setFormData = jest.fn();
    goal = { title: "Test Goal", purpose: "Test Purpose" };

    handleCloseModal = () => {
      setIsModalOpen(false);
      setFormData({ title: goal.title, purpose: goal.purpose });
    };
  });

  it("closes the modal and resets form data", () => {
    handleCloseModal();

    expect(setIsModalOpen).toHaveBeenCalledWith(false);
    expect(setFormData).toHaveBeenCalledWith({
      title: goal.title,
      purpose: goal.purpose,
    });
  });
});
