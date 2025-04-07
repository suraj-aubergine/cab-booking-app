import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Bookings } from '@/components/pages/Bookings';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

// Import the new pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// Placeholder components for missing pages
const RoutesPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Routes Page</h1></div>;
const Notifications = () => <div className="p-6"><h1 className="text-2xl font-bold">Notifications Page</h1></div>;
const Settings = () => <div className="p-6"><h1 className="text-2xl font-bold">Settings Page</h1></div>;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const { isAuthenticated } = useAuthStore();
  
  // For debugging
  useEffect(() => {
    console.log('Auth state:', { isAuthenticated });
  }, [isAuthenticated]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Register />
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App; 