"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import railsAPI from "@/services/rails-api";
import { useRouter } from "next/navigation";
import Notification from "@/app/components/Notification";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Switch } from "@headlessui/react";
import Spinner from "@/app/components/Spinner";

const GoalPlanPage = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [advice, setAdvice] = useState("");
  const [creator, setCreator] = useState("");
  const [img_url, setImageUrl] = useState(null);
  const [repeatTerm, setRepeatTerm] = useState("");
  const [repeatTime, setRepeatTime] = useState("09:00");
  const [setReminder, setSetReminder] = useState(true);
  const [reminderMinutes, setReminderMinutes] = useState(0);
  const [duration, setDuration] = useState("");
  const [durationLength, setDurationLength] = useState(null);
  const [durationMeasure, setDurationMeasure] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    // Fetch goal plan data
    const fetchGoalPlanData = async () => {
      try {
        const response = await railsAPI.get(`/goal_plans/${id}`);

        if (response.status === 200) {
          const goalPlanData = response.data;
          setTitle(goalPlanData.title);
          setPurpose(goalPlanData.purpose);
          setAdvice(goalPlanData.advice);
          setImageUrl(goalPlanData.image_url);
          setCreator(goalPlanData.creator.username);
          setRepeatTerm(goalPlanData.repeat_term);
          setDuration(goalPlanData.duration);
          setDurationLength(goalPlanData.duration_length);
          setDurationMeasure(goalPlanData.duration_measure);
        }
      } catch (err) {
        if (err.status === 404) {
          router.push("/404");
        } else {
          setNotification({
            type: "error",
            message: "Something went wrong. Please try again.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGoalPlanData();
  }, [id]);

  // Handle goal creation
  const handleGoalCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const goalData = {
      title,
      purpose,
      repeat_term: repeatTerm,
      repeat_time: repeatTime,
      set_reminder: setReminder,
      reminder_minutes: setReminder ? reminderMinutes : null,
      duration,
      duration_length: duration === "specific_duration" ? durationLength : null,
      duration_measure:
        duration === "specific_duration" ? durationMeasure : null,
      graph_type: duration === "specific_duration" ? "bar" : "dot",
      is_private: isPrivate,
    };

    try {
      const response = await railsAPI.post("/goals", { goal: goalData });

      if (response.status === 201) {
        const goalId = response.data.id;
        router.push(`/goals/${goalId}`); // Redirect after successful goal creation

        setNotification({
          type: "success",
          message: "Goal created successfully!",
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to create goal. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const repeatMapping = {
    daily: "Every Day",
    weekly: "Every Week",
    monthly: "Every Month",
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8">
        <div className="mx-auto sm:w-full sm:max-w-lg">
          <nav className="px-12" aria-label="Breadcrumb">
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
                    Goal Plans
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
                  {title}
                </a>
              </li>
            </ol>
          </nav>
          <div className="p-12">
            <div>
              <div className="flex items-center min-w-0 gap-x-4">
                {img_url ? (
                  <img
                    alt="Goal Plan image"
                    src={img_url}
                    className="size-12 flex-none rounded-full bg-gray-50"
                  />
                ) : (
                  <img
                    alt="Goal Plan image"
                    src="https://img.freepik.com/free-vector/arrow-hitting-target_1034-50.jpg?ga=GA1.1.813922924.1739959609&semt=ais_hybrid"
                    className="size-12 flex-none rounded-full bg-gray-50"
                  />
                )}
                <div className="min-w-0">
                  <h1 className="text-base/4 font-semibold text-gray-900">
                    {title}
                  </h1>
                  <p className="text-xs text-gray-500">
                    by <span className="font-bold">{creator}</span>
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <p className="text-sm text-gray-500">{purpose}</p>
                {advice && (
                  <p className="text-sm font-bold text-gray-500">
                    Advice: <span className="font-light">{advice}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-bold text-gray-900">Repeat:</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {repeatMapping[repeatTerm]}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 py-2 font-bold text-gray-900">
                    Time:
                  </dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {/* Repeat Time */}
                    <div>
                      <label
                        htmlFor="repeat_time"
                        className="block text-sm font-bold text-gray-900"
                      ></label>
                      <input
                        id="repeat_time"
                        name="repeat_time"
                        type="time"
                        value={repeatTime}
                        onChange={(e) => setRepeatTime(e.target.value)}
                        className="block  rounded-md bg-white  px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </dd>
                </div>
                {duration == "specific_duration" && (
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm/6 font-bold text-gray-900">
                      Duration
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {durationLength} {durationMeasure}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <form onSubmit={handleGoalCreate} className="space-y-6">
              <fieldset>
                <div className="my-4 space-y-2">
                  <div className="flex items-center gap-x-3">
                    <input
                      checked={isPrivate}
                      id="private"
                      name="goal-privacy"
                      type="radio"
                      onChange={() => setIsPrivate(true)}
                      className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                    />
                    <label
                      htmlFor="private"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Create this goal and remain private
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      checked={!isPrivate}
                      id="shared"
                      name="goal-privacy"
                      type="radio"
                      onChange={() => setIsPrivate(false)}
                      className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                    />
                    <label
                      htmlFor="shared"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Join and share your progress with this group publicly
                    </label>
                  </div>
                </div>
              </fieldset>

              {/* Set Reminder */}
              <div>
                <div className="flex items-center">
                  <label
                    htmlFor="reminder_minutes"
                    className="block text-sm font-bold text-gray-900"
                  >
                    Set Reminder:
                  </label>
                  <Switch
                    checked={setReminder}
                    onChange={setSetReminder}
                    className="mx-3 group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-500"
                  >
                    <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                  </Switch>
                </div>

                {setReminder && (
                  <div className="mt-2">
                    <div className="sm:col-span-3">
                      <div className="mt-2 grid grid-cols-1">
                        <select
                          id="reminder_minutes"
                          name="reminder_minutes"
                          type="number"
                          value={reminderMinutes}
                          onChange={(e) =>
                            setReminderMinutes(parseInt(e.target.value))
                          }
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md border bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        >
                          <option value="0">At time of event</option>
                          <option value="5">5 minutes before</option>
                          <option value="10">10 minutes before</option>
                          <option value="15">15 minutes before</option>
                          <option value="30">30 minutes before</option>
                          <option value="60">1 hour before</option>
                        </select>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="flex w-full h-9 justify-center items-center rounded-md bg-custom-yellow border-2 border-black px-3 py-1.5 text-sm font-semibold text-black shadow-xs hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoalPlanPage;
