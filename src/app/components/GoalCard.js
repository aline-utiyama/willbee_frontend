"use client";
import GoalProgressBarChart from "@/app/components/BarChart";
import GoalProgressHeatmap from "@/app/components/HeatMap";

const GoalCard = ({ goal, onClick }) => {
  const calculateStreak = () => {
    const progresses = goal.goal_progresses || [];
    let streak = 10;
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

  const getProgressColor = (streak) => {
    if (streak >= 7) {
      return "green";
    } else if (streak >= 3) {
      return "yellow";
    } else {
      return "red";
    }
  };

  const streak = calculateStreak();
  const progressColor = getProgressColor(streak);
  const isTrendingUp = streak > 0;

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
      className="cursor-pointer bg-white shadow-md rounded-lg p-6 px-10 flex flex-col justify-items-start gap-3 hover:bg-gray-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col ml-4">
          <h2 className="text-xl font-bold text-gray-900">{goal.title}</h2>
        </div>
        <div className="flex items-center border-2 rounded-full p-2" style={{ borderColor: progressColor }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={progressColor}
            className="size-6"
            style={{ transform: isTrendingUp ? "rotate(0deg)" : "rotate(90deg)" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
          </svg>
        </div>
      </div>
      <div className="mt-4">{renderGraph()}</div>
    </div>
  );
};

export default GoalCard;
