import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import GoalsList from '@/app/goals/list/page';
import railsAPI from '@/services/rails-api';
import { useRouter } from 'next/navigation';

jest.mock('@/services/rails-api');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('GoalsList', () => {
  it('renders the goals list page', () => {
    render(<GoalsList />);
    expect(screen.getByText('My goals')).toBeInTheDocument();
  });

  it('fetches and displays goals', async () => {
    const goals = [
      { id: 1, title: 'Goal 1', graph_type: 'bar' },
      { id: 2, title: 'Goal 2', graph_type: 'line' },
    ];
    railsAPI.get.mockResolvedValue({ data: goals });

    render(<GoalsList />);

    await waitFor(() => {
      goals.forEach(goal => {
        expect(screen.getByText(goal.title)).toBeInTheDocument();
      });
    });
  });

  it('displays an error message when fetching goals fails', async () => {
    railsAPI.get.mockRejectedValue(new Error('Failed to fetch goals data'));

    render(<GoalsList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch goals data')).toBeInTheDocument();
    });
  });

  it('navigates to the correct goal page when a goal is clicked', async () => {
    const goals = [
      { id: 1, title: 'Goal 1', graph_type: 'bar' },
      { id: 2, title: 'Goal 2', graph_type: 'line' },
    ];
    const push = jest.fn();
    useRouter.mockImplementation(() => ({ push }));
    railsAPI.get.mockResolvedValue({ data: goals });

    render(<GoalsList />);

    await waitFor(() => {
      goals.forEach(goal => {
        expect(screen.getByText(goal.title)).toBeInTheDocument();
      });
    });

    fireEvent.click(screen.getByText('Goal 1'));
    expect(push).toHaveBeenCalledWith('/goals/1');

    fireEvent.click(screen.getByText('Goal 2'));
    expect(push).toHaveBeenCalledWith('/goals/2');
  });
});
