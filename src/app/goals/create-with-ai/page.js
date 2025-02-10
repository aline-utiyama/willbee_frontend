"use client";
import { useState, useEffect } from "react";
import nextAPI from "@/services/next-api";
import { useRouter } from "next/navigation";
import GoalForm from "@/app/components/GoalForm";
import Notification from "@/app/components/Notification";
import railsAPI from "@/services/rails-api";
import Image from "next/image";

const GoalCreateWithAIPage = () => {
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [repeatTerm, setRepeatTerm] = useState("daily");
  const [repeatTime, setRepeatTime] = useState("09:00");
  const [duration, setDuration] = useState("specific_duration");
  const [durationLength, setDurationLength] = useState(30);
  const [durationMeasure, setDurationMeasure] = useState("minutes");
  const [setReminder, setSetReminder] = useState(true);
  const [reminderMinutes, setReminderMinutes] = useState(0);
  const [notification, setNotification] = useState(null);
  const [botResponse, setBotResponse] = useState(false);

  const [errors, setErrors] = useState({});

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Initialize chat with bot's first message
  useEffect(() => {
    setMessages([
      { text: "What is the goal you would like to accomplish?", sender: "bot" },
    ]);
  }, []);

  const callOpenAi = async (userMessage) => {
    const userGoal = {
      title: userMessage[1].text,
      purpose: userMessage[3].text,
    };

    try {
      const response = await nextAPI.post("/chat-gpt", {
        userGoal: userGoal,
      });

      if (response.data?.advice !== undefined) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: response.data.advice, sender: "bot" },
        ]);
      }

      if (response.data?.title !== undefined) {
        setBotResponse(true);
        setTitle(response.data.title);
      }
      if (response.data?.purpose !== undefined) {
        setPurpose(response.data.purpose);
      }

      if (response.data?.purpose !== undefined) {
        setPurpose(response.data.purpose);
      }

      if (
        response.data?.repeat_term !== undefined &&
        ["daily", "weekly", "monthly"].includes(response.data?.repeat_term)
      ) {
        setRepeatTerm(response.data.repeat_term);
      }

      if (
        response.data?.duration !== undefined &&
        ["specific_duration", "entire_day"].includes(response.data?.duration)
      ) {
        setDuration(response.data.duration);
      }

      if (
        response.data?.duration_length !== undefined &&
        Number.isInteger(response.data?.duration_length)
      ) {
        setDurationLength(response.data.duration_length);
      }

      if (
        response.data?.duration_measure !== undefined &&
        ["Minutes", "Hours", "Kilometers", "Pages"].includes(
          response.data?.duration_measure
        )
      ) {
        setDurationMeasure(response.data.duration_measure);
      }
    } catch (err) {
      console.error("Error calling Chat-gpt:", err);
    }
  };

  // Send message function
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    const newMessages = [...messages, { text: userInput, sender: "user" }];
    setMessages(newMessages);
    setUserInput("");

    let botResponse = "";

    if (step === 1) {
      botResponse =
        "The most effective way to achieve a goal and stay motivated is by identifying its purpose. What is the purpose behind your goal?";
      setStep(2);
    } else if (step === 2) {
      botResponse =
        "Great! Just give me a moment to craft the perfect plan tailored just for you...";
      setStep(3);
      setLoading(true);

      // Display bot's message first
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botResponse, sender: "bot" },
        ]);

        // Call OpenAI API
        callOpenAi(newMessages);
      }, 3000);

      return;
    }

    // Add bot response
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, sender: "bot" },
      ]);
    }, 1000);
  };

  const handleGoalCreate = async (e) => {
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

    if (!repeatTerm) {
      formErrors.repeatTerm = "Repeat term is required.";
    }

    if (!repeatTime) {
      formErrors.repeatTime = "Repeat time is required.";
    }

    if (setReminder && reminderMinutes < 0) {
      formErrors.reminderMinutes = "Reminder minutes are required.";
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
    };

    try {
      const response = await railsAPI.post("/goals", { goal: goalData });

      if (response.status === 201) {
        const goalId = response.data.id;
        router.push(`/goals/${goalId}`); // Redirect after successful goal creation
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

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="flex flex-1 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col flex-1 md:mx-auto md:w-full md:max-w-lg">
          <h2 className="text-lg font-semibold mb-4">
            Create a Goal with AI help
          </h2>

          {/* Chat Container */}
          <div className="flex flex-1 flex-col bg-white">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Avatar (Bot) */}
                  {msg.sender === "bot" && (
                    <div className="relative w-12 h-12 p-[2px] rounded-full bg-gradient-to-r from-[#BE50C0] to-[#F5C419]">
                      <Image
                        alt="Bot Avatar"
                        src="/images/bee_bot.png"
                        className="w-full h-full rounded-full bg-white p-1 object-cover object-center"
                        width={100}
                        height={100}
                      />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`p-3 rounded-xl max-w-xs ${
                      msg.sender === "user"
                        ? "bg-gray-100  ml-auto"
                        : "bg-white"
                    }`}
                  >
                    {msg.text.includes("http") ? (
                      <img
                        src={msg.text}
                        alt="Sent Image"
                        className="rounded-lg"
                      />
                    ) : (
                      msg.text
                    )}
                  </div>

                  {/* Avatar (User) */}
                  {msg.sender === "user" && (
                    <img
                      src="https://i.pravatar.cc/40?img=1"
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                </div>
              ))}
            </div>

            {botResponse ? (
              <GoalForm
                title={title}
                setTitle={setTitle}
                purpose={purpose}
                setPurpose={setPurpose}
                repeatTerm={repeatTerm}
                setRepeatTerm={setRepeatTerm}
                repeatTime={repeatTime}
                setRepeatTime={setRepeatTime}
                duration={duration}
                setDuration={setDuration}
                durationLength={durationLength}
                setDurationLength={setDurationLength}
                durationMeasure={durationMeasure}
                setDurationMeasure={setDurationMeasure}
                setReminder={setReminder}
                setSetReminder={setSetReminder}
                reminderMinutes={reminderMinutes}
                setReminderMinutes={setReminderMinutes}
                errors={errors}
                handleGoalCreate={handleGoalCreate}
              />
            ) : (
              <div className="flex flex-col border border-gray-200 rounded-lg  p-4 bg-white h-36 shadow-lg">
                {/* Input Box */}
                <textarea
                  className="flex-1 resize-none p-2 border-none outline-none focus:ring-0 text-gray-900"
                  placeholder="Type a message..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      // Check for Enter key without Shift
                      e.preventDefault(); // Prevent newline in the textarea
                      sendMessage(); // Trigger sendMessage when Enter is pressed
                    }
                  }}
                ></textarea>

                {/* Button positioned at the bottom-right */}
                <div className="flex justify-end mt-2">
                  <button
                    onClick={sendMessage}
                    disabled={loading || step === 3}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GoalCreateWithAIPage;
