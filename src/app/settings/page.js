"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import railsAPI from "@/services/rails-api";
import { logout } from "../actions/auth";
import { getUser } from "../actions/user";
import Notification from "../components/Notification";

const SettingsPage = () => {
  const [userId, setUserId] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [surnameValue, setSurnameValue] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);

  // Form validation Errors state
  const [errors, setErrors] = useState({});

  const router = useRouter();

  // Fetch user data
  const fetchUserData = async () => {
    try {
      // Update state with user data
      const user = await getUser(); // Call the getUser action
      const { id, name, surname, username, email } = user;

      setUserId(id || "");
      setNameValue(name || "");
      setSurnameValue(surname || "");
      setUsernameValue(username || "");
      setEmailValue(email || "");
    } catch (err) {
      //Log out and redirect to login page if fetching user data fails
      logout(() => {
        router.push("/login");
      });
    }
  };

  const handleUserInfoUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate inputs
    let formErrors = {};

    if (!validateMinLength(nameValue, 2)) {
      //setError("Name must be at least 2 characters long.");
      formErrors.name = "Name must be at least 2 characters long.";
    }

    if (!validateMinLength(surnameValue, 2)) {
      //setError("Surname must be at least 2 characters long.");
      formErrors.surname = "Surname must be at least 2 characters long.";
    }

    if (!validateMinLength(usernameValue, 2)) {
      //setError("Username must be at least 2 characters long.");
      formErrors.username = "Username must be at least 2 characters long.";
    }

    if (!validateEmail(emailValue)) {
      //setError("Invalid email address");
      formErrors.email = "Invalid email address";
    }

    if (Object.keys(formErrors).length > 0) {
      setLoading(false);
      setErrors(formErrors);
      return; // Don't submit the form if there are errors
    }

    try {
      const response = await railsAPI.put(`/users/${userId}`, {
        user: {
          name: nameValue,
          surname: surnameValue,
          username: usernameValue,
          email: emailValue,
        },
      });

      if (response.status === 200) {
        setNotification({
          type: "success",
          message: "Successfully updated!",
        });
      }
    } catch (err) {
      setError("Failed to update user. Please try again.");
      setNotification({
        type: "error",
        message: "Failed to update user. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMinLength = (text, minLength = 2) => {
    return text.trim().length >= minLength;
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
        <div className="md:mx-auto md:w-full md:max-w-md">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Update your information
          </h2>
        </div>

        <div className="mt-10 md:mx-auto md:w-full md:max-w-md px-12 py-12 rounded-md border-t border-gray-200 bg-white shadow-md">
          <form onSubmit={handleUserInfoUpdate} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="surname"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Surname
              </label>
              <div className="mt-2">
                <input
                  id="surname"
                  name="surname"
                  type="text"
                  value={surnameValue}
                  onChange={(e) => setSurnameValue(e.target.value)}
                  autoComplete="surname"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.surname && (
                  <p className="text-red-500 text-sm mt-1">{errors.surname}</p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={usernameValue}
                  onChange={(e) => setUsernameValue(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
