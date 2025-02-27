"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import railsAPI from "@/services/rails-api";
import GoalPlanCard from "@/app/components/GoalPlanCard";
import Spinner from "@/app/components/Spinner";

const GoalPlansList = () => {
  const [goalPlans, setGoalPlans] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const router = useRouter();

  const fetchGoals = async () => {
    try {
      const response = await railsAPI.get(`/goal_plans`, {
        params: category ? { category } : {},
      });
      const sortedData = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setGoalPlans(sortedData);
    } catch (err) {
      setError("Failed to fetch goal plans data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGoals();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="mt-3 md:mx-auto md:w-full md:max-w-lg">
      <div className="py-12">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-2"
          >
            <li>
              <div className="flex items-center">
                <a
                  href="/dashboard"
                  className="mr-2 text-md font-medium text-gray-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-4 text-gray-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-4 text-gray-300"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.528 3.047a.75.75 0 0 1 .449.961L8.433 16.504a.75.75 0 1 1-1.41-.512l4.544-12.496a.75.75 0 0 1 .961-.449Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <a
                  href="/goal-plans/list"
                  className="mr-2 text-md font-medium text-gray-600"
                >
                  All Plans
                </a>
                {category && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-4 text-gray-300"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.528 3.047a.75.75 0 0 1 .449.961L8.433 16.504a.75.75 0 1 1-1.41-.512l4.544-12.496a.75.75 0 0 1 .961-.449Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </li>
            {category && (
              <li className="text-md">
                <a
                  href="#"
                  aria-current="page"
                  className="font-medium text-gray-900 hover:text-gray-600"
                >
                  {category}
                </a>
              </li>
            )}
          </ol>
        </nav>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-1 mx-auto flex max-w-2xl items-center py-4 px-2">
          {goalPlans &&
            goalPlans.map((goalPlan) => (
              <GoalPlanCard
                key={goalPlan.id}
                goalPlan={goalPlan}
                onClick={() => router.push(`/goal-plans/${goalPlan.id}`)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default GoalPlansList;
