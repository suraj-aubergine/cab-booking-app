import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChartBarIcon,
  UsersIcon,
  TruckIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/stores/useAuthStore";

const adminNavItems = [
  { href: "/admin", icon: ChartBarIcon, title: "Dashboard" },
  { href: "/admin/users", icon: UsersIcon, title: "Users" },
  { href: "/admin/drivers", icon: TruckIcon, title: "Drivers" },
  { href: "/admin/vehicles", icon: TruckIcon, title: "Vehicles" },
  { href: "/admin/bookings", icon: CalendarIcon, title: "Bookings" },
  { href: "/admin/settings", icon: Cog6ToothIcon, title: "Settings" },
];

export function AdminSidebar() {
  const { logout } = useAuthStore();

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Panel
        </h1>
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={logout}
        >
          <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
} 