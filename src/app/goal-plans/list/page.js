"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import railsAPI from "@/services/rails-api";

const GoalPlansList = () => {
  const [goalPlans, setGoalPlans] = useState([]);
  const [errors, setErrors] = useState("");
  const router = useRouter();

  const fetchGoals = async () => {
    try {
      const response = await railsAPI.get(`/goal_plans`);
      setGoalPlans(response.data);
    } catch (err) {
      setErrors("Failed to fetch goals data");
    }
  };
  useEffect(() => {
    fetchGoals();
  }, []);
  return (
    <div className="mt-3 md:mx-auto md:w-full md:max-w-lg">
      Goal Plans List
      {errors && <p style={{ color: "red" }}>{errors}</p>}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-1 mx-auto flex max-w-2xl items-center py-4 px-2">
        {goalPlans &&
          goalPlans.map((goalPlan) => (
            <div
              key={goalPlan.id}
              onClick={() => router.push(`/goal-plans/${goalPlan.id}`)}
              className="cursor-pointer"
            >
              {goalPlan.title}
            </div>
          ))}
      </div>
    </div>
  );
};

export default GoalPlansList;
