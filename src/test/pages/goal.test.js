import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GoalPage from "@/app/goals/[id]/page";
import railsAPI from "@/services/rails-api";
import { useRouter, useParams } from "next/navigation";

jest.mock("@/services/rails-api", () => ({
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
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
      data: { title: "Learn Japanese", purpose: "To work in Japan" },
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
      data: { title: "Learn Japanese", purpose: "To work in Japan" },
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

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Master Kanji" },
    });
    fireEvent.change(screen.getByLabelText("Purpose"), {
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
      data: { title: "Learn Japanese", purpose: "To work in Japan" },
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

    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Purpose"), {
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
      data: { title: "Learn Japanese", purpose: "To work in Japan" },
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
      expect(screen.getByLabelText("Title")).toHaveValue("Learn Japanese");
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
      data: { title: "Learn Japanese", purpose: "To work in Japan" },
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
      data: { title: "Learn Japanese", purpose: "To work in Japan" },
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
