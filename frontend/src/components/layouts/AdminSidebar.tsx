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
} from "@heroicons/react/24/outline";

const adminNavItems = [
  { href: "/admin", icon: ChartBarIcon, title: "Dashboard" },
  { href: "/admin/users", icon: UsersIcon, title: "Users" },
  { href: "/admin/drivers", icon: TruckIcon, title: "Drivers" },
  { href: "/admin/vehicles", icon: TruckIcon, title: "Vehicles" },
  { href: "/admin/bookings", icon: CalendarIcon, title: "Bookings" },
  { href: "/admin/settings", icon: Cog6ToothIcon, title: "Settings" },
];

export function AdminSidebar() {
  return (
    <div className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r bg-card lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b p-6">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
        </div>
        <ScrollArea className="flex-1 py-6">
          <nav className="grid gap-2 px-4">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </NavLink>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
} 