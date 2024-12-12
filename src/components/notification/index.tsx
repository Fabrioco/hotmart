import React from "react";
import { useNotification } from "../../contexts/notificationContext";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
const Notification: React.FC = () => {
  const { notification } = useNotification();

  if (!notification) return null;

  return (
    <div className="fixed top-20 right-40 bg-white text-black text-3xl px-4 py-2 rounded-md border border-gray-300 shadow-md animate-bounce">
      <p
        className={`flex items-center gap-4 ${
          notification.type === "success" ? "text-green-600" : "text-red-600"
        } `}
      >
        <i>
          {notification.type === "success" ? (
            <FaCheckCircle size={30} />
          ) : (
            <IoCloseCircle size={30} />
          )}
        </i>
        {notification.message}
      </p>
    </div>
  );
};

export default Notification;
