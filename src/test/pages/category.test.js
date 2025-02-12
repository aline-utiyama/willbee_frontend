import { render, screen, fireEvent } from '@testing-library/react';
import GoalPlansCategory from '@/app/goal-plans/category/page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('GoalPlansCategory', () => {
  let pushMock;

  beforeEach(() => {
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
  });

  it('renders category names and images', () => {
    render(<GoalPlansCategory />);

    const categories = [
      "Customized Goal",
      "AI Goal Builder",
      "Fitness",
      "Diet",
      "Music",
      "Self-Development",
      "Career",
      "Reading",
      "Sports",
    ];

    categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
      expect(screen.getByAltText(category)).toBeInTheDocument();
    });
  });

  it('navigates to the correct page when a category is clicked', () => {
    render(<GoalPlansCategory />);

    fireEvent.click(screen.getByText("Customized Goal"));
    expect(pushMock).toHaveBeenCalledWith("/goals/create");

    fireEvent.click(screen.getByText('AI Goal Builder'));
    expect(pushMock).toHaveBeenCalledWith('/goals/create-with-ai');
  });
});
