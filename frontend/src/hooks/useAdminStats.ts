import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

interface AdminStats {
  users: {
    total: number;
    newThisWeek: number;
    activeToday: number;
  };
  drivers: {
    total: number;
    available: number;
  };
  bookings: {
    total: number;
    pending: number;
  };
  revenue: {
    thisMonth: number;
    lastMonth: number;
  };
  incidents: {
    total: number;
    pending: number;
  };
  trends: {
    bookings: Array<{ date: string; count: number }>;
    revenue: Array<{ date: string; amount: number }>;
    incidents: Array<{ date: string; count: number }>;
  };
}

export function useAdminStats() {
  const { token, user } = useAuthStore();

  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      if (!token || user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      const { data } = await api.get<{ data: AdminStats }>('/admin/stats');
      return data.data;
    },
    retry: false,
    enabled: !!token && user?.role === 'ADMIN',
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: false,
  });
} 