"use client";

const GoalCard = ({ title, startDate }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">Started on: {new Date(startDate).toLocaleDateString()}</p>
    </div>
  );
};

export default GoalCard;
