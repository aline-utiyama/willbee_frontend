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

  return (
    <div className="mt-3 md:mx-auto md:w-full md:max-w-lg">
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
                href="#"
                aria-current="page"
                className="font-medium text-gray-900 hover:text-gray-600"
              >
                My goals
              </a>
            </div>
          </li>
        </ol>
      </nav>

      {errors && <p style={{ color: "red" }}>{errors}</p>}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-1 mx-auto flex max-w-2xl items-center py-4 px-2">
        {Array.isArray(goals) &&
          goals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => router.push(`/goals/${goal.id}`)}
              className="cursor-pointer"
            >
              <GoalCard title={goal.title} graph_type={goal.graph_type} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default GoalsList;
