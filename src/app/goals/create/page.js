"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import nextAPI from "../../../services/rails-api";


const GoalCreatePage = () => {
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [repeatTerm, setRepeatTerm] = useState("");
  const [repeatTime, setRepeatTime] = useState("");
  const [advice, setAdvice] = useState("");
  const [setReminder, setSetReminder] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState("");
  const [duration, setDuration] = useState("");
  const [durationLength, setDurationLength] = useState("");
  const [durationMeasure, setDurationMeasure] = useState("");
  const [graphType, setGraphType] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const goal = {
      title,
      purpose,
      repeat_term: repeatTerm,
      repeat_time: repeatTime,
      advice,
      set_reminder: setReminder,
      reminder_minutes: reminderMinutes,
      duration,
      duration_length: durationLength,
      duration_measure: durationMeasure,
      graph_type: graphType,
      is_private: isPrivate,
    };

    try {

      const response = await nextAPI.post("/goals", {
        title,
        purpose,
        repeat_term: repeatTerm,
        repeat_time: repeatTime,
        advice,
        set_reminder: setReminder,
        reminder_minutes: reminderMinutes,
        duration,
        duration_length: durationLength,
        duration_measure: durationMeasure,
        graph_type: graphType,
        is_private: isPrivate,
      });

      if (response.status === 201) {
        console.log("Goal submitted successfully");
        setTitle("");
        setPurpose("");
        setRepeatTerm("");
        setRepeatTime("");
        setAdvice("");
        setSetReminder("");
        setReminderMinutes("");
        setDuration("");
        setDurationLength("");
        setDurationMeasure("");
        setGraphType("");
        setIsPrivate(false);
        router.push("/dashboard"); // Redirect to dashboard after successful submission
      } else {
        setError("Failed to submit goal");
      }
    } catch (error) {
      setError("Error submitting goal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Create a New Goal</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleGoalSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Goal Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
            Purpose
          </label>
          <textarea
            id="purpose"
            name="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="repeatTerm" className="block text-sm font-medium text-gray-700">
            Repeat Term
          </label>
          <input
            id="repeatTerm"
            name="repeatTerm"
            type="text"
            value={repeatTerm}
            onChange={(e) => setRepeatTerm(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="repeatTime" className="block text-sm font-medium text-gray-700">
            Repeat Time
          </label>
          <input
            id="repeatTime"
            name="repeatTime"
            type="text"
            value={repeatTime}
            onChange={(e) => setRepeatTime(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="advice" className="block text-sm font-medium text-gray-700">
            Advice
          </label>
          <textarea
            id="advice"
            name="advice"
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="setReminder" className="block text-sm font-medium text-gray-700">
            Set Reminder
          </label>
          <input
            id="setReminder"
            name="setReminder"
            type="text"
            value={setReminder}
            onChange={(e) => setSetReminder(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="reminderMinutes" className="block text-sm font-medium text-gray-700">
            Reminder Minutes
          </label>
          <input
            id="reminderMinutes"
            name="reminderMinutes"
            type="text"
            value={reminderMinutes}
            onChange={(e) => setReminderMinutes(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration
          </label>
          <input
            id="duration"
            name="duration"
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="durationLength" className="block text-sm font-medium text-gray-700">
            Duration Length
          </label>
          <input
            id="durationLength"
            name="durationLength"
            type="text"
            value={durationLength}
            onChange={(e) => setDurationLength(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="durationMeasure" className="block text-sm font-medium text-gray-700">
            Duration Measure
          </label>
          <input
            id="durationMeasure"
            name="durationMeasure"
            type="text"
            value={durationMeasure}
            onChange={(e) => setDurationMeasure(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="graphType" className="block text-sm font-medium text-gray-700">
            Graph Type
          </label>
          <input
            id="graphType"
            name="graphType"
            type="text"
            value={graphType}
            onChange={(e) => setGraphType(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="isPrivate" className="block text-sm font-medium text-gray-700">
            Is Private
          </label>
          <input
            id="isPrivate"
            name="isPrivate"
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? "Submitting..." : "Add Goal"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalCreatePage;
