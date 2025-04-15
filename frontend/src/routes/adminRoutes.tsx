import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/types/auth';

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const UsersTable = lazy(() => import('@/pages/admin/UsersTable'));
const DriversTable = lazy(() => import('@/pages/admin/DriversTable'));
const VehiclesTable = lazy(() => import('@/pages/admin/VehiclesTable'));
const BookingsTable = lazy(() => import('@/pages/admin/BookingsTable'));

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <UsersTable /> },
      { path: 'drivers', element: <DriversTable /> },
      { path: 'vehicles', element: <VehiclesTable /> },
      { path: 'bookings', element: <BookingsTable /> },
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },
]; 