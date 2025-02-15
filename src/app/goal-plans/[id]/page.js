"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import railsAPI from "@/services/rails-api";
import { useRouter } from "next/navigation";

const GoalPlanPage = () => {
  const { id } = useParams();
  const [goalPlan, setGoalPlan] = useState({ title: "", purpose: "" });
  const router = useRouter();

  // Form validation Errors state
  const [error, setError] = useState({});

  useEffect(() => {
    if (!id) return;

    // Fetch goal plan data
    const fetchGoalPlanData = async () => {
      try {
        const response = await railsAPI.get(`/goal_plans/${id}`);

        if (response.status === 200) {
          const goalPlanData = response.data;
          setGoalPlan(goalPlanData);
          setFormData({
            title: goalPlanData.title,
            purpose: goalPlanData.purpose,
          });
        }
      } catch (err) {
        if (err.status === 404) {
          router.push("/404");
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    };

    fetchGoalPlanData();
  }, [id]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      Goal Plan page
      <div>{goalPlan.title}</div>
    </div>
  );
};

export default GoalPlanPage;
