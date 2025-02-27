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

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "mock-image-url");
  });

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
    expect(screen.getByLabelText("Category:")).toBeInTheDocument();
    expect(screen.getByLabelText("Repeat Term:")).toBeInTheDocument();
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
    fireEvent.change(screen.getByLabelText("Category:"), {
      target: { value: "Other" },
    });

    // Ensure the file input exists
    const fileInput = await waitFor(() =>
      screen.getByLabelText(/Upload Image:/i)
    );

    // Mock file upload
    const file = new File(["dummy-content"], "test-image.png", {
      type: "image/png",
    });

    // Ensure Jest can detect file input change
    Object.defineProperty(fileInput, "files", {
      value: [file],
    });

    fireEvent.change(fileInput);

    await waitFor(() =>
      expect(screen.getByText("Create Goal Plan")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Create Goal Plan"));

    await waitFor(() => {
      // Get the FormData object from the mock API call
      const formData = railsAPI.post.mock.calls[0][1];

      // Ensure the request contains FormData
      expect(formData).toBeInstanceOf(FormData);

      // Verify that FormData contains the expected values
      expect(formData.get("goal_plan[title]")).toBe("Test Goal Plan");
      expect(formData.get("goal_plan[purpose]")).toBe("Test Purpose");
      expect(formData.get("goal_plan[category]")).toBe("Other");

      // Ensure the image file is included
      expect(formData.get("goal_plan[image]")).toBeInstanceOf(File);

      // Ensure navigation happens after submission
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
      expect(screen.getByText("Category is required.")).toBeInTheDocument();
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
    fireEvent.change(screen.getByLabelText("Category:"), {
      target: { value: "Other" },
    });
    fireEvent.click(screen.getByText("Create Goal Plan"));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to create goal plan. Please try again.")
      ).toBeInTheDocument();
    });
  });
});
