"use client";

const GoalCard = ({ title, graph_type }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600">{graph_type}</p>
    </div>
  );
};

export default GoalCard;
