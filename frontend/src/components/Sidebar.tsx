import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Map, 
  Bell, 
  Settings, 
  LogOut 
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export function Sidebar() {
  const { logout } = useAuthStore();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cab Booking</h1>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center p-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                }`
              }
            >
              <Home className="w-5 h-5 mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                `flex items-center p-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                }`
              }
            >
              <Calendar className="w-5 h-5 mr-3" />
              <span>Bookings</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/routes"
              className={({ isActive }) =>
                `flex items-center p-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                }`
              }
            >
              <Map className="w-5 h-5 mr-3" />
              <span>Routes</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `flex items-center p-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                }`
              }
            >
              <Bell className="w-5 h-5 mr-3" />
              <span>Notifications</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center p-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                }`
              }
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </NavLink>
          </li>
          <li>
            <button
              onClick={logout}
              className="w-full flex items-center p-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
} 