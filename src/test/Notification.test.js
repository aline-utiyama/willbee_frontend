import { render, screen, fireEvent } from "@testing-library/react";
import Notification from "@/app/components/Notification";

describe("Notification", () => {
  let onCloseMock;

  beforeEach(() => {
    // Mock the onClose function
    onCloseMock = jest.fn();
  });

  test("renders success notification", () => {
    render(
      <Notification message="Success!" type="success" onClose={onCloseMock} />
    );

    // Check if the success message is displayed
    expect(screen.getByText("Success!")).toBeInTheDocument();
  });

  test("renders error notification", () => {
    render(
      <Notification message="Error!" type="error" onClose={onCloseMock} />
    );

    // Check if the error message is displayed
    expect(screen.getByText("Error!")).toBeInTheDocument();
  });

  test("calls onClose when the close button is clicked", () => {
    render(
      <Notification message="Success!" type="success" onClose={onCloseMock} />
    );

    // Get the close button and simulate a click event
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    // Check if the onClose function is called once when the close button is clicked
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
