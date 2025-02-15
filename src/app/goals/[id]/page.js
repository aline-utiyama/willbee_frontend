"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import railsAPI from "@/services/rails-api";
import { useRouter } from "next/navigation";
import GoalProgressBarChart from "@/app/components/BarChart";
import GoalProgressHeatmap from "@/app/components/HeatMap";

const GoalPage = () => {
  const { id } = useParams();
  const [goal, setGoal] = useState({ title: "", purpose: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", purpose: "" });

  // Form validation Errors state
  const [errors, setErrors] = useState({});

  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    // Fetch goal data
    const fetchGoalData = async () => {
      try {
        const response = await railsAPI.get(`/goals/${id}`);

        if (response.status === 200) {
          const goalData = response.data;
          setGoal(goalData);
          setFormData({ title: goalData.title, purpose: goalData.purpose });
          setLoading(false);
        }
      } catch (err) {
        if (err.status === 404) {
          router.push("/404");
        } else {
          setLoading(false);
          setError("Something went wrong. Please try again.");
        }
      }
    };

    fetchGoalData();
  }, [id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleEditClick = () => {
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDropdownOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ title: goal.title, purpose: goal.purpose });
  };

  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();

    setError("");

    // Validate inputs
    let formErrors = {};

    if (!validateMinLength(formData.title, 2)) {
      formErrors.title = "Title must be at least 2 characters long.";
    }

    if (!validateMinLength(formData.purpose, 2)) {
      formErrors.purpose = "Purpose must be at least 2 characters long.";
    }

    if (Object.keys(formErrors).length > 0) {
      setLoading(false);
      setErrors(formErrors);
      return; // Don't submit the form if there are errors
    }

    try {
      const response = await railsAPI.put(`/goals/${id}`, {
        goal: {
          title: formData.title,
          purpose: formData.purpose,
        },
      });

      if (response.status === 200) {
        const updatedGoal = await response.data;
        setGoal(updatedGoal);
        setIsModalOpen(false);
      }
    } catch (err) {
      setError("Failed to update goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await railsAPI.delete(`/goals/${id}`);

      if (response.status == 204) {
        setIsDeleteModalOpen(false);
        router.push("/goals/list"); // Redirect after deletion
      }
    } catch (err) {
      setError("Failed to delete goal. Please try again.");
    }
  };

  const validateMinLength = (text, minLength = 2) => {
    return text.trim().length >= minLength;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-red-500">{error}</p>
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
      <div className="md:mx-auto md:w-full md:max-w-lg relative">
        <div>
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
                    href="/goals/list"
                    className="mr-2 text-md font-medium text-gray-600"
                  >
                    My goals
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

              <li className="text-md">
                <a
                  href="#"
                  aria-current="page"
                  className="font-medium text-gray-900 hover:text-gray-600"
                >
                  {goal.title}
                </a>
              </li>
            </ol>
          </nav>
          {/* Three-Dot Dropdown Button */}
          <div className="absolute top-0 right-0" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="py-1 px-3 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              ⋮
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                <button
                  onClick={handleEditClick}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Edit
                </button>
                {/* <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Share
                </button> */}
                <button
                  onClick={handleDeleteClick}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="py-8">
          <ol>
            <li>{goal.purpose}</li>
            <li>{goal.repeat_term}</li>
            {goal.duration === "specific_duration" && (
              <li>
                {goal.duration_length} {goal.duration_measure}
              </li>
            )}
          </ol>
        </div>
        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Edit Goal</h2>
              <form onSubmit={handleUpdateGoal}>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-bold text-gray-900"
                  >
                    Title:
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border rounded"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="purpose"
                    className="block text-sm font-bold text-gray-900"
                  >
                    Purpose:
                  </label>
                  <textarea
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border rounded"
                  />
                  {errors.purpose && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.purpose}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
              <h2 className="text-xl font-bold mb-4">Delete Goal</h2>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this goal?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleCloseDeleteModal}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center pr-2 pt-4 rounded-md border-t border-gray-200 bg-white shadow-md">
          {goal.graph_type == "bar" && goal.goal_progresses && (
            <GoalProgressBarChart goalData={goal} />
          )}
          {goal.graph_type == "dot" && goal.goal_progresses && (
            <GoalProgressHeatmap goalData={goal} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalPage;
