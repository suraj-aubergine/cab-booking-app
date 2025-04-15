import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { AdminStats } from '@/types/admin';
import { useToast } from '@/hooks/useToast';

export function useAdminStats() {
  const { toast } = useToast();

  return useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/admin/stats');
        return data.data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch admin statistics",
          variant: "destructive",
        });
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2, // Retry failed requests up to 2 times
    staleTime: 10000, // Consider data fresh for 10 seconds
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

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
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