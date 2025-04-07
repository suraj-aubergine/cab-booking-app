import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserRole } from '@/types/auth';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Calendar,
  Users,
  Car,
  Settings,
  ClipboardList,
  UserCog,
  Bell,
  MapPin,
  ShieldCheck
} from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isCollapsed: boolean;
  isActive?: boolean;
}

function NavItem({ href, icon, title, isCollapsed, isActive }: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
        isActive ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 dark:text-indigo-400" : "hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10",
        isCollapsed ? "justify-center" : ""
      )}
    >
      {icon}
      {!isCollapsed && <span>{title}</span>}
    </Link>
  );
}

const adminRoutes = [
  {
    title: 'Dashboard',
    href: '/app/admin',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Users',
    href: '/app/admin/users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Drivers',
    href: '/app/admin/drivers',
    icon: <UserCog className="h-5 w-5" />,
  },
  {
    title: 'Vehicles',
    href: '/app/admin/vehicles',
    icon: <Car className="h-5 w-5" />,
  },
  {
    title: 'Bookings',
    href: '/app/admin/bookings',
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    title: 'Safety',
    href: '/app/admin/safety',
    icon: <ShieldCheck className="h-5 w-5" />,
  },
];

const userRoutes = [
  {
    href: "/app",
    icon: <LayoutDashboard className="h-5 w-5" />,
    title: "Dashboard",
    role: null,
  },
  {
    href: "/app/bookings",
    icon: <Calendar className="h-5 w-5" />,
    title: "My Bookings",
    role: UserRole.EMPLOYEE,
  },
  {
    href: "/app/routes",
    icon: <MapPin className="h-5 w-5" />,
    title: "Routes",
    role: UserRole.EMPLOYEE,
  },
  {
    href: "/app/notifications",
    icon: <Bell className="h-5 w-5" />,
    title: "Notifications",
    role: null,
  },
  {
    href: "/app/settings",
    icon: <Settings className="h-5 w-5" />,
    title: "Settings",
    role: null,
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuthStore();
  const location = useLocation();

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-white/50 backdrop-blur-xl dark:bg-gray-900/50 h-screen sticky top-0 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-3 bg-white/80 dark:bg-gray-900/80">
        {!isCollapsed && (
          <span className="font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
            Transport App
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hover:bg-indigo-500/10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      <nav className="flex-1 space-y-4 p-4">
        {user?.role === UserRole.ADMIN ? (
          <div className="space-y-2">
            {adminRoutes.map((route) => (
              <NavItem
                key={route.href}
                href={route.href}
                icon={route.icon}
                title={route.title}
                isCollapsed={isCollapsed}
                isActive={location.pathname === route.href}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {userRoutes.map((item) =>
              (!item.role || user?.role === item.role) && (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                  isCollapsed={isCollapsed}
                  isActive={location.pathname === item.href}
                />
              )
            )}
          </div>
        )}
      </nav>
    </div>
  );
} 