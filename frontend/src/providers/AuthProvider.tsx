import React from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLocation, useNavigate } from 'react-router-dom';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const currentPath = location.pathname;
    const isPublicPath = ['/login', '/register'].includes(currentPath);
    const isRootPath = currentPath === '/';

    if (!isAuthenticated && !isPublicPath) {
      // Save the attempted URL
      navigate('/login', { 
        state: { from: location },
        replace: true 
      });
    } else if (isAuthenticated && (isPublicPath || isRootPath)) {
      // Redirect authenticated users from public routes
      const redirectPath = user?.role === 'ADMIN' ? '/app/admin' : '/app';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, location, navigate]);

  return children;
} 