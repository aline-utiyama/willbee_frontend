import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GoalCreateWithAIPage from "@/app/goals/create-with-ai/page";
import { useRouter } from "next/navigation";
import railsAPI from "@/services/rails-api";
import nextAPI from "@/services/next-api";
import { useUser } from "@/app/context/UserProvider";

jest.setTimeout(10000);

// Mock Next.js hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/services/rails-api", () => ({
  post: jest.fn(),
}));

jest.mock("@/services/next-api", () => ({
  post: jest.fn(),
}));

jest.mock("@/app/context/UserProvider", () => ({
  useUser: jest.fn(),
}));

beforeEach(() => {
  useUser.mockReturnValue({
    user: {
      id: "123",
      name: "Test User",
      image_url: "https://example.com/avatar.jpg",
    },
  });
});

describe("GoalCreateWithAIPage Component", () => {
  let pushMock;

  beforeEach(() => {
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
  });

  it("renders the chat interface and form correctly", async () => {
    render(<GoalCreateWithAIPage />);

    expect(
      await screen.findByText("What is the goal you would like to accomplish?")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type a message...")
    ).toBeInTheDocument();
  });

  it("allows user to enter messages and receive AI response", async () => {
    nextAPI.post.mockResolvedValue({
      data: {
        title: "AI Suggested Goal",
        purpose: "AI Suggested Purpose",
      },
    });

    render(<GoalCreateWithAIPage />);

    fireEvent.change(screen.getByPlaceholderText("Type a message..."), {
      target: { value: "I want to run a marathon" },
    });

    fireEvent.click(screen.getByText("Send"));

    await waitFor(
      () => {
        expect(
          screen.getByText(
            "The most effective way to achieve a goal and stay motivated is by identifying its purpose. What is the purpose behind your goal?"
          )
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("allows user to submit the goal form with AI suggestions", async () => {
    nextAPI.post.mockResolvedValue({
      data: {
        title: "AI Suggested Goal",
        purpose: "AI Suggested Purpose",
        advice: "AI Advice",
      },
    });
    railsAPI.post.mockResolvedValue({ status: 201, data: { id: "456" } });

    render(<GoalCreateWithAIPage />);

    fireEvent.change(screen.getByPlaceholderText("Type a message..."), {
      target: { value: "I want to learn programming" },
    });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(
      () => {
        expect(
          screen.getByText(
            "The most effective way to achieve a goal and stay motivated is by identifying its purpose. What is the purpose behind your goal?"
          )
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    fireEvent.change(screen.getByPlaceholderText("Type a message..."), {
      target: { value: "To have a better salary." },
    });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(
      () => {
        expect(
          screen.getByText(
            "Great! Just give me a moment to craft the perfect plan tailored just for you..."
          )
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Create Goal"));
    });

    await waitFor(() => {
      expect(railsAPI.post).toHaveBeenCalledWith(
        "/goals",
        expect.objectContaining({
          goal: expect.objectContaining({
            title: "AI Suggested Goal",
            purpose: "AI Suggested Purpose",
          }),
        })
      );
      expect(pushMock).toHaveBeenCalledWith("/goals/456");
    });
  });

  it("shows an error when required fields are missing", async () => {
    render(<GoalCreateWithAIPage />);
    fireEvent.change(screen.getByPlaceholderText("Type a message..."), {
      target: { value: "I want to learn programming" },
    });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(
      () => {
        expect(
          screen.getByText(
            "The most effective way to achieve a goal and stay motivated is by identifying its purpose. What is the purpose behind your goal?"
          )
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    fireEvent.change(screen.getByPlaceholderText("Type a message..."), {
      target: { value: "To have a better salary." },
    });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(
      () => {
        expect(
          screen.getByText(
            "Great! Just give me a moment to craft the perfect plan tailored just for you..."
          )
        ).toBeInTheDocument();
      },
      { timeout: 6000 }
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title:")).toBeInTheDocument();
      expect(screen.getByLabelText("Purpose:")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Title:"), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByLabelText("Purpose:"), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByLabelText("Duration:"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("Create Goal"));

    await waitFor(() => {
      expect(screen.getByText("Title is required.")).toBeInTheDocument();
      expect(screen.getByText("Purpose is required.")).toBeInTheDocument();
    });
  });

  it("shows an error notification if goal creation fails", async () => {
    nextAPI.post.mockResolvedValue({
      data: {
        title: "AI Suggested Goal",
        purpose: "AI Suggested Purpose",
      },
    });
    railsAPI.post.mockRejectedValue(new Error("Failed to create goal"));

    render(<GoalCreateWithAIPage />);

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText("Type a message..."), {
        target: { value: "I want to get fit" },
      });
      fireEvent.click(screen.getByText("Send"));
    });

    await waitFor(
      () => {
        expect(
          screen.getByText(
            "The most effective way to achieve a goal and stay motivated is by identifying its purpose. What is the purpose behind your goal?"
          )
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    fireEvent.change(screen.getByPlaceholderText("Type a message..."), {
      target: { value: "To have a better salary." },
    });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(
      () => {
        expect(
          screen.getByText(
            "Great! Just give me a moment to craft the perfect plan tailored just for you..."
          )
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Create Goal"));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Failed to create goal. Please try again.")
      ).toBeInTheDocument();
    });
  });
});
