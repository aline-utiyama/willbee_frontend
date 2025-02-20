"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import railsAPI from "@/services/rails-api";
import Notification from "@/app/components/Notification";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

const CATEGORIES = [
  "Fitness",
  "Health",
  "Music",
  "Personal Growth",
  "Career",
  "Sports",
  "Reading",
  "Other",
];

const GoalPlansCreatePage = () => {
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [advice, setAdvice] = useState("");
  const [category, setCategory] = useState("");
  const [repeatTerm, setRepeatTerm] = useState("daily");
  const [repeatTime, setRepeatTime] = useState("09:00");
  const [duration, setDuration] = useState("specific_duration");
  const [durationLength, setDurationLength] = useState(30);
  const [durationMeasure, setDurationMeasure] = useState("minutes");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Error state
  const [errors, setErrors] = useState({});

  // Handle goal Plan creation
  const handleGoalPlanCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate inputs
    let formErrors = {};

    if (!title) {
      formErrors.title = "Title is required.";
    }

    if (!purpose) {
      formErrors.purpose = "Purpose is required.";
    }

    if (!category) formErrors.category = "Category is required.";

    if (!repeatTerm) {
      formErrors.repeatTerm = "Repeat term is required.";
    }

    if (duration === "specific_duration" && !durationLength) {
      formErrors.durationLength = "Duration length is required.";
    }

    if (duration === "specific_duration" && !durationMeasure) {
      formErrors.durationMeasure = "Duration measure is required.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Don't submit the form if there are errors
    }

    const goalPlanData = {
      title,
      purpose,
      advice,
      category,
      repeat_term: repeatTerm,
      repeat_time: repeatTime,
      duration,
      duration_length: duration === "specific_duration" ? durationLength : null,
      duration_measure:
        duration === "specific_duration" ? durationMeasure : null,
    };

    try {
      const response = await railsAPI.post("/goal_plans", {
        goal_plan: goalPlanData,
      });

      if (response.status === 201) {
        const goalPlanId = response.data.id;
        router.push(`/goal-plans/${goalPlanId}`);
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to create goal plan. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="md:mx-auto md:w-full md:max-w-lg">
          <nav aria-label="Breadcrumb">
            <ol
              role="list"
              className="mx-auto flex max-w-2xl items-center space-x-2 px-2"
            >
              <li>
                <div className="flex items-center">
                  <a
                    href="#"
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

              <li className="text-md">
                <a
                  href="#"
                  aria-current="page"
                  className="font-medium text-gray-500 hover:text-gray-600"
                >
                  Create a Goal Plan
                </a>
              </li>
            </ol>
          </nav>
        </div>

        <div className="mt-3 md:mx-auto md:w-full md:max-w-lg">
          <div className="px-12 py-12 rounded-md border-t border-gray-200 bg-white shadow-md">
            <form onSubmit={handleGoalPlanCreate} className="space-y-6">
              {/* Goal Plan Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-bold text-gray-900"
                >
                  Title:
                </label>
                <div className="mt-2">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>
              </div>

              {/* Goal Plan Purpose */}
              <div>
                <label
                  htmlFor="purpose"
                  className="block text-sm font-bold text-gray-900"
                >
                  Purpose:
                </label>
                <div className="mt-2">
                  <input
                    id="purpose"
                    name="purpose"
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {errors.purpose && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.purpose}
                    </p>
                  )}
                </div>
              </div>

              {/* Goal Plan Advice */}
              <div>
                <label
                  htmlFor="advice"
                  className="block text-sm font-bold text-gray-900"
                >
                  Advice:
                </label>
                <div className="mt-2">
                  <input
                    id="advice"
                    name="advice"
                    type="text"
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {errors.advice && (
                    <p className="text-red-500 text-sm mt-1">{errors.advice}</p>
                  )}
                </div>
              </div>

              {/* Category Selector */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-bold text-gray-900"
                >
                  Category:
                </label>
                <div className="relative mt-2">
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full appearance-none rounded-md border bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-2 top-2.5 h-5 w-5 text-gray-500" />
                </div>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Repeat Term */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="repeat_term"
                  className="block text-sm/6 font-bold text-gray-900"
                >
                  Repeat Term:
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="repeat_term"
                    name="repeat_term"
                    value={repeatTerm}
                    onChange={(e) => setRepeatTerm(e.target.value)}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md border bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                  {errors.repeatTerm && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.repeatTerm}
                    </p>
                  )}
                </div>
              </div>

              {/* Set Duration */}
              <div>
                <label
                  htmlFor="set_specific_duration"
                  className="block text-sm font-bold text-gray-900"
                >
                  Duration:
                </label>
                <div className="mt-2">
                  <div className="mt-2 flex items-center">
                    <input
                      type="radio"
                      id="set_specific_duration"
                      name="set_specific_duration"
                      value={duration}
                      checked={duration === "specific_duration"}
                      onChange={() => setDuration("specific_duration")}
                    />
                    <label
                      htmlFor="set_specific_duration"
                      className="ml-2 text-sm text-gray-700 w-full"
                    >
                      <div>
                        <div className="outline-1 outline-gray-300">
                          <div className="flex items-center rounded-md border border-solid border-gray-200 bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                            <label htmlFor="duration_length"></label>
                            <input
                              type="number"
                              id="duration_length"
                              name="duration_length"
                              data-testid="duration_length"
                              value={durationLength}
                              onChange={(e) =>
                                setDurationLength(e.target.value)
                              }
                              placeholder="30"
                              disabled={duration !== "specific_duration"}
                              className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 disabled:bg-white disabled:text-gray-400"
                            />
                            <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                              <select
                                id="duration_measure"
                                name="duration_measure"
                                data-testid="duration_measure"
                                value={durationMeasure}
                                disabled={duration !== "specific_duration"}
                                onChange={(e) =>
                                  setDurationMeasure(e.target.value)
                                }
                                className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:text-gray-400 sm:text-sm/6"
                              >
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="kilometers">Kilometers</option>
                                <option value="pages">Pages</option>
                              </select>
                              <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                              />
                            </div>
                          </div>
                          {errors.durationLength && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.durationLength}
                            </p>
                          )}
                          {errors.durationMeasure && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.durationMeasure}
                            </p>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="mt-3 flex items-center">
                    <input
                      type="radio"
                      id="set_entire_day_true"
                      name="set_entire_day"
                      value={duration}
                      checked={duration === "entire_day"}
                      onChange={() => setDuration("entire_day")}
                    />
                    <label
                      htmlFor="set_entire_day_true"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Entire Day
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="flex w-full h-9 justify-center items-center rounded-md bg-custom-yellow border-2 border-black px-3 py-1.5 text-sm font-semibold text-black shadow-xs hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Create Goal Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoalPlansCreatePage;
