import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/useToast';

export interface Location {
  id: string;
  name: string;
  address: string;
}

export function useLocations() {
  const { toast } = useToast();

  return useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: async () => {
      try {
        const { data } = await api.get<{ success: boolean; data: Location[] }>('/locations');
        if (!data.success) {
          throw new Error('Failed to fetch locations');
        }
        return data.data;
      } catch (error) {
        console.error('Error fetching locations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load locations. Please try again.',
          variant: 'destructive',
        });
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
} 