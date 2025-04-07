import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface AdminStats {
  users: {
    total: number;
    activeToday: number;
    newThisWeek: number;
  };
  bookings: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  trends: {
    bookings: { date: string; count: number }[];
    revenue: { date: string; amount: number }[];
  };
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats');
      return data.data;
    },
  });
}

export function useUsersList() {
  return useQuery({
    queryKey: ['users-list'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data.data;
    },
  });
}

export function useDriversList() {
  return useQuery({
    queryKey: ['drivers-list'],
    queryFn: async () => {
      const { data } = await api.get('/admin/drivers');
      return data.data;
    },
  });
}

export function useVehiclesList() {
  return useQuery({
    queryKey: ['vehicles-list'],
    queryFn: async () => {
      const { data } = await api.get('/admin/vehicles');
      return data.data;
    },
  });
} 