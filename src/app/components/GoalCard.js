"use client";
import GoalProgressBarChart from "@/app/components/BarChart";
import GoalProgressHeatmap from "@/app/components/HeatMap";

const GoalCard = ({ goal, onClick }) => {

  const calculateStreak = () => {
    // Logic to calculate the streak based on goal.progresses
    const progresses = goal.goal_progresses || [];
    let streak = 0;
    let maxStreak = 0;

    progresses.forEach((progress) => {
      if (progress.completed) {
        streak += 1;
        if (streak > maxStreak) {
          maxStreak = streak;
        }
      } else {
        streak = 0;
      }
    });

    return maxStreak;
  };

  const getProgressImage = (streak) => {
    if (streak >= 10) {
      return "/images/Good-progress.png";
    } else {
      return "/images/Bad-progress.png";
    }
  };

  const streak = calculateStreak();
  const progressImage = getProgressImage(streak);

  const renderGraph = () => {
    if (goal.graph_type === "bar") {
      return <GoalProgressBarChart goalData={goal} />;
    } else if (goal.graph_type === "dot") {
      return <GoalProgressHeatmap goalData={goal} />;
    } else {
      return <p>No graph available</p>;
    }
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white shadow-md rounded-lg p-4 flex flex-col justify-items-start gap-3 hover:bg-gray-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col ml-4">
          <h2 className="text-xl font-bold text-gray-900">{goal.title}</h2>
        </div>
        <img
          alt="Progress image"
          src={progressImage}
          className="size-12 flex-none rounded-full bg-gray-50"
        />
      </div>
      <div className="mt-4">{renderGraph()}</div>
    </div>
  );
};

export default GoalCard;
