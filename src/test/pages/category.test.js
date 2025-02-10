import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GoalPlansCategory from '../../src/app/goal-plans/category/page';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('GoalPlansCategory', () => {
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
    const push = jest.fn();
    useRouter.mockImplementation(() => ({ push }));

    render(<GoalPlansCategory />);

    fireEvent.click(screen.getByText('Customized Goal'));
    expect(push).toHaveBeenCalledWith('/goals/create');

    fireEvent.click(screen.getByText('AI Goal Builder'));
    expect(push).toHaveBeenCalledWith('/goals/create-with-ai');

    fireEvent.click(screen.getByText('Fitness'));
    expect(push).toHaveBeenCalledWith('/goal-plans/list');
  });
});
