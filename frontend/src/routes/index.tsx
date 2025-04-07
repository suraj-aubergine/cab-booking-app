import { createBrowserRouter } from 'react-router-dom';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Bookings } from '@/pages/bookings/Bookings';
import { NewBooking } from '@/pages/bookings/NewBooking';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { DriverDashboard } from '@/pages/driver/DriverDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/types/auth';
import { Settings } from "@/pages/settings/Settings";
import { MyBookings } from "@/pages/bookings/MyBookings";
import { UsersTable } from '@/pages/admin/UsersTable';
import { DriversTable } from '@/pages/admin/DriversTable';
import { VehiclesTable } from '@/pages/admin/VehiclesTable';
import { BookingsTable } from '@/pages/admin/BookingsTable';

export const router = createBrowserRouter([
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'register',
    element: <Register />,
  },
  {
    path: 'app',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'bookings',
        element: <MyBookings />,
      },
      {
        path: 'bookings/new',
        element: <NewBooking />,
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <UsersTable />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/drivers',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <DriversTable />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/vehicles',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <VehiclesTable />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/bookings',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <BookingsTable />
          </ProtectedRoute>
        ),
      },
      {
        path: 'driver',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.DRIVER]}>
            <DriverDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <Login />,
  },
]); 