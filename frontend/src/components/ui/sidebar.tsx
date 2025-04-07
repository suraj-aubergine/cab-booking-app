import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  Home,
  CalendarPlus,
  CalendarClock,
  Users,
  UserCog,
  Car,
  CalendarRange,
  BarChart,
  LogOut
} from 'lucide-react';

const mainNavItems = [
  { name: 'Dashboard', to: '/', icon: Home },
  { name: 'New Booking', to: '/bookings/new', icon: CalendarPlus },
  { name: 'My Bookings', to: '/bookings', icon: CalendarClock },
];

const adminNavItems = [
  { name: 'Users', to: '/users', icon: Users },
  { name: 'Drivers', to: '/drivers', icon: UserCog },
  { name: 'Vehicles', to: '/vehicles', icon: Car },
  { name: 'All Bookings', to: '/bookings/all', icon: CalendarRange },
  { name: 'Reports', to: '/reports', icon: BarChart },
];

export function Sidebar() {
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.clearAuth);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CabBerry</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                  location.pathname === item.to
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}

            {isAdmin && (
              <>
                <div className="mt-6 mb-2 px-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase">Admin</h3>
                </div>
                {adminNavItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                      location.pathname === item.to
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </div>
        </nav>

        {/* User Profile */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="ml-auto rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 