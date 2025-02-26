"use client";

import { useNotifications } from "../context/NotificationProvider";
import { useState, useRef, useEffect } from "react";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import railsAPI from "@/services/rails-api";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotificationsTab() {
  const { notifications, removeNotification, markNotificationAsRead } =
    useNotifications();

  const unseenCount = notifications.filter((n) => !n.seen).length;

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dateToday = new Date().toISOString().split("T")[0];
  const router = useRouter();

  // Function to handle clicks outside the notification dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const markAsComplete = async (notification) => {
    try {
      const response = await railsAPI.patch(
        `/goal_progresses/${notification.goal_progress_id}/complete_progress_through_notifications`,
        { date_today: dateToday, notification_id: notification.id }
      );
      if (response.status === 200) {
        removeNotification(notification.id);
        setOpen(false);
        router.push(`/goals/${notification.goal_id}`);
      }
    } catch (err) {
      console.error("Failed to mark task as completed. Please try again.");
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500  focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 focus:outline-hidden"
      >
        <span className="absolute -inset-1.5" />
        <span className="sr-only">View notifications</span>
        <BellIcon aria-hidden="true" className="size-6" />
        {unseenCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
            {unseenCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 w-96 p-2 z-50" ref={dropdownRef}>
          {notifications.length === 0 ? (
            <div className="relative p-8 mb-2 bg-white shadow-lg rounded-md border-t border-gray-200">
              <p>No notifications.</p>
            </div>
          ) : (
            <div className="h-screen overflow-y-auto p-2 space-y-2">
              {notifications.map((notif, i) => (
                <div
                  key={i}
                  className="relative p-8 mb-2 bg-white shadow-lg rounded-md border-t border-gray-200"
                >
                  <button
                    type="button"
                    onClick={() => markNotificationAsRead(notif.id, dateToday)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-500 sm:top-2 sm:right-2 md:top-2 md:right-2 lg:top-2 lg:right-2"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                  <div className="flex items-center">
                    <div className=" w-[80px] h-12 p-[2px] rounded-full bg-gradient-to-r from-[#BE50C0] to-[#F5C419]">
                      <Image
                        alt="Bot Avatar"
                        src="/images/bee_bot.png"
                        className="w-full h-full rounded-full bg-white p-1 object-cover object-center"
                        width={100}
                        height={100}
                      />
                    </div>
                    <p className="pl-2">{notif.message}</p>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        markNotificationAsRead(notif.id, dateToday);
                        router.push(`/goals/${notif.goal_id}`);
                        setOpen(false);
                      }}
                      className="mt-4 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => markAsComplete(notif)}
                      className="mt-4 ml-4 px-4 py-2 rounded-md text-sm bg-black text-white hover:bg-gray-600"
                    >
                      Mark as Completed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
