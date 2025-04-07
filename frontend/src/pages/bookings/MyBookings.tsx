import { useUserBookings, Booking } from "@/hooks/useUserBookings";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">
            {booking.pickup.name} → {booking.drop.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(booking.scheduledTime), "PPP 'at' p")}
          </p>
          <p className="text-sm text-muted-foreground">
            Booked by: {booking.user.firstName} {booking.user.lastName}
          </p>
        </div>
        <div className="text-right">
          <span 
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              {
                "bg-yellow-100 text-yellow-800": booking.status === "PENDING",
                "bg-green-100 text-green-800": booking.status === "CONFIRMED",
                "bg-blue-100 text-blue-800": booking.status === "IN_PROGRESS",
                "bg-gray-100 text-gray-800": booking.status === "COMPLETED",
                "bg-red-100 text-red-800": booking.status === "CANCELLED",
              }
            )}
          >
            {booking.status}
          </span>
        </div>
      </div>
      <div className="mt-2 text-sm">
        <p>Vehicle: {booking.vehicleType}</p>
        <p>Passengers: {booking.passengerCount}</p>
        {booking.notes && <p>Notes: {booking.notes}</p>}
      </div>
    </div>
  );
}

export function MyBookings() {
  const { data: bookings, isLoading } = useUserBookings();

  const upcomingBookings = bookings?.filter(
    (booking) => 
      booking.status !== "COMPLETED" && 
      booking.status !== "CANCELLED" &&
      new Date(booking.scheduledTime) > new Date()
  );

  const pastBookings = bookings?.filter(
    (booking) => 
      booking.status === "COMPLETED" || 
      booking.status === "CANCELLED" ||
      new Date(booking.scheduledTime) <= new Date()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <Link to="/app/bookings/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Booking
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div>Loading bookings...</div>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastBookings?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No upcoming bookings</p>
                <Link to="/app/bookings/new" className="text-primary hover:underline">
                  Create a new booking
                </Link>
              </div>
            ) : (
              upcomingBookings?.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No past bookings</p>
              </div>
            ) : (
              pastBookings?.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 