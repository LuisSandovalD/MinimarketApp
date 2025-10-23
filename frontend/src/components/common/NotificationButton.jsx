// src/components/common/NotificationButton.jsx
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getNotification } from "../../api/notification";

export default function NotificationButton() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await getNotification();
      const data = res?.data || res;
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-full hover:bg-blue-700"
      >
        <Bell size={22} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1.5">
            {notifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white text-black rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2 font-semibold border-b border-gray-200">
            Notificaciones
          </div>
          {notifications.length === 0 ? (
            <p className="p-3 text-gray-600 text-sm text-center">
              Sin notificaciones
            </p>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {notifications.map((n, index) => (
                <li
                  key={index}
                  className="p-3 text-sm border-b border-gray-100 hover:bg-gray-50"
                >
                  {n.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
