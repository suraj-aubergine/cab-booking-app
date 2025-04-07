import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { format } from "date-fns";

interface Location {
  id: string;
  name: string;
  address: string;
}

interface Booking {
  id: string;
  pickup: Location;
  drop: Location;
  scheduledTime: string;
  vehicleType: string;
  numberOfPassengers: number;
  status: string;
  specialRequirements?: string;
}

export function Bookings() {
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await api.get("/bookings");
      return response.data.data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <Link to="/app/bookings/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Booking
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : bookings?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No bookings found. Create your first booking!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings?.map((booking) => (
            <div
              key={booking.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {booking.pickup.name} → {booking.drop.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(booking.scheduledTime), "PPP 'at' p")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                    {booking.status}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-sm">
                <p>Vehicle: {booking.vehicleType}</p>
                <p>Passengers: {booking.numberOfPassengers}</p>
                {booking.specialRequirements && (
                  <p>Notes: {booking.specialRequirements}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 