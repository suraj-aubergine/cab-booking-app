import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    switch (user.role) {
      case UserRole.ADMIN:
        return <Navigate to="/admin" replace />;
      case UserRole.MANAGER:
        return <Navigate to="/manager" replace />;
      default:
        return <Navigate to="/app" replace />;
    }
  }

  return <>{children}</>;
} 