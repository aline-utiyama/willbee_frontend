import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Switch } from "@headlessui/react";

const GoalForm = ({
  title,
  setTitle,
  purpose,
  setPurpose,
  repeatTerm,
  setRepeatTerm,
  repeatTime,
  setRepeatTime,
  duration,
  setDuration,
  durationLength,
  setDurationLength,
  durationMeasure,
  setDurationMeasure,
  setReminder,
  setSetReminder,
  reminderMinutes,
  setReminderMinutes,
  errors,
  handleGoalCreate,
}) => {
  return (
    <div className="px-12 py-12 rounded-md border-t border-gray-200 bg-white shadow-md">
      <form onSubmit={handleGoalCreate} className="space-y-6">
        {/* Goal Title */}
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

        {/* Goal Purpose */}
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
              <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
            )}
          </div>
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
              <p className="text-red-500 text-sm mt-1">{errors.repeatTerm}</p>
            )}
          </div>
        </div>

        {/* Repeat Time */}
        <div>
          <label
            htmlFor="repeat_time"
            className="block text-sm font-bold text-gray-900"
          >
            Time:
          </label>
          <input
            id="repeat_time"
            name="repeat_time"
            type="time"
            value={repeatTime}
            onChange={(e) => setRepeatTime(e.target.value)}
            className="block w-full rounded-md bg-white mt-2 px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          {errors.repeatTime && (
            <p className="text-red-500 text-sm mt-1">{errors.repeatTime}</p>
          )}
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
                        onChange={(e) => setDurationLength(e.target.value)}
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
                          onChange={(e) => setDurationMeasure(e.target.value)}
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
                  {errors.reminderMinutes && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.reminderMinutes}
                    </p>
                  )}
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
  );
};

export default GoalForm;
