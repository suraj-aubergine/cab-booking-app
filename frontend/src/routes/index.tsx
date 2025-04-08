import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layouts/RootLayout';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/types/auth';
import { ErrorBoundary, ErrorPage } from '@/components/ErrorBoundary';
import { Navigate } from 'react-router-dom';

// Auth pages
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';

// User pages
import { Dashboard } from '@/pages/Dashboard';
import { Bookings } from '@/pages/bookings/Bookings';
import { NewBooking } from '@/pages/bookings/NewBooking';
import { Settings } from '@/pages/settings/Settings';

// Admin pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { UsersTable } from '@/pages/admin/UsersTable';
import { DriversTable } from '@/pages/admin/DriversTable';
import { VehiclesTable } from '@/pages/admin/VehiclesTable';
import { BookingsTable } from '@/pages/admin/BookingsTable';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { NotFound } from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/app',
        element: (
          <ErrorBoundary>
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          </ErrorBoundary>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'bookings', element: <Bookings /> },
          { path: 'bookings/new', element: <NewBooking /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
      {
        path: '/app/admin',
        element: (
          <ErrorBoundary>
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          </ErrorBoundary>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'users', element: <UsersTable /> },
          { path: 'drivers', element: <DriversTable /> },
          { path: 'vehicles', element: <VehiclesTable /> },
          { path: 'bookings', element: <BookingsTable /> },
          { path: 'settings', element: <AdminSettings /> },
        ],
      },
      {
        path: '/',
        element: <Login />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]); 