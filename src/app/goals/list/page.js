"use client";
import { useEffect, useState } from "react";
import { getGoal } from "../../actions/goals";
import GoalCard from "../../components/GoalCard";

const GoalsList = () => {
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState("");

  const fetchGoals = async () => {
    try {
      const goalsData = await getGoal();
      console.log("Fetched goals data:", goalsData); // Add this line
      setGoals(goalsData);
    } catch (err) {
      setError("Failed to fetch goals data");
    }
  };
  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">My Goals</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(goals) && goals.map((goal) => (
          <GoalCard key={goal.id} title={goal.title} graph_type={goal.graph_type} />
        ))}
      </div>
    </div>
  );
};

export default GoalsList;
