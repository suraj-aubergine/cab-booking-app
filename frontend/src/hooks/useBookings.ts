import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/useToast'
import { BookingResponse } from '@/types/booking'

interface Booking {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'
  scheduledTime: string
  pickup: { address: string }
  drop: { address: string }
  createdAt: string
}

export function useBookings() {
  const { toast } = useToast()

  return useQuery<BookingResponse>({
    queryKey: ['bookings'],
    queryFn: async () => {
      try {
        const response = await api.get('/bookings/my-bookings')
        return response.data
      } catch (error: any) {
        const errorMessage = error.response?.data?.error?.message || 'Failed to fetch bookings'
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
        throw new Error(errorMessage)
      }
    },
    retry: 1,
  })
}

export function useBookingStats() {
  return useQuery({
    queryKey: ['booking-stats'],
    queryFn: async () => {
      const { data } = await api.get<{
        data: {
          pending: number
          upcoming: number
          total: number
        }
      }>('/bookings/stats')
      return data.data
    }
  })
} 