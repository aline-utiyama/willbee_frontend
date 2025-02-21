"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GoalCard from "../../components/GoalCard";
import railsAPI from "@/services/rails-api";

const GoalsList = () => {
  const [goals, setGoals] = useState([]);
  const [errors, setErrors] = useState("");
  const router = useRouter();

  const fetchGoals = async () => {
    try {
      const response = await railsAPI.get(`/goals`);
      setGoals(response.data);
    } catch (err) {
      setErrors("Failed to fetch goals data");
    }
  };
  useEffect(() => {
    fetchGoals();
  }, []);

  if (errors) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-red-500">{errors}</p>
        <a
          href="/"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div className="mt-3 md:mx-auto md:w-full md:max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">My Goals</h1>
      <div className="space-y-4">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onClick={() => router.push(`/goals/${goal.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default GoalsList;
