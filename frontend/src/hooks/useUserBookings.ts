import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

export interface Booking {
  id: string;
  pickup: {
    id: string;
    name: string;
    address: string;
  };
  drop: {
    id: string;
    name: string;
    address: string;
  };
  scheduledTime: string;
  vehicleType: "SEDAN" | "SUV" | "VAN";
  passengerCount: number;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export function useUserBookings() {
  const { toast } = useToast();

  return useQuery<Booking[]>({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      try {
        const response = await api.get("/bookings/my-bookings");
        if (!response.data.success) {
          throw new Error(response.data.error?.message || "Failed to fetch bookings");
        }
        return response.data.data;
      } catch (error: any) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load bookings. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
  });
} 