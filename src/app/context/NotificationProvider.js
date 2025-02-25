"use client";

import { createContext, useEffect, useState, useContext } from "react";
import { createConsumer } from "@rails/actioncable";
import railsAPI from "@/services/rails-api";
import { getUser } from "@/app/actions/user";

const NotificationContext = createContext([]);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get JWT token from storage

    const fetchUserId = async () => {
      try {
        const user = await getUser(); // Wait for the user data
        setUserId(user.id); // Update state with user ID
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserId(); // Call the function

    if (!token) {
      console.warn("⚠️ No token found, WebSocket connection will fail");
      return;
    }

    // Attach the token to the WebSocket URL
    const consumer = createConsumer(`ws://localhost:4000/cable?token=${token}`);

    const subscription = consumer.subscriptions.create(
      { channel: "NotificationsChannel", user_id: userId },
      {
        connected() {
          console.log("Connected to WebSocket!");
        },
        received(data) {
          setNotifications((prev) => [...prev, data]);
        },
        disconnected() {
          console.log("WebSocket Disconnected");
        },
      }
    );

    return () => {
      subscription.unsubscribe(); // Cleanup on unmount
    };
  }, [userId]);

  // Function to mark a notification as read
  const markNotificationAsRead = async (id, date) => {
    try {
      await railsAPI.patch(`/notifications/${id}/mark_as_read`, { date: date });
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // Function to remove a notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, removeNotification, markNotificationAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
