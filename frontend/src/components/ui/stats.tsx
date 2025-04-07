import { Clock, Calendar, Car } from 'lucide-react';
import { useBookingStats } from '@/hooks/useBookings';

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function Stats() {
  const { data: stats, isLoading } = useBookingStats();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Pending Bookings"
        value={stats?.pending ?? 0}
        description="Awaiting confirmation"
        icon={<Clock className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Upcoming Rides"
        value={stats?.upcoming ?? 0}
        description="Confirmed and scheduled"
        icon={<Calendar className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Total Bookings"
        value={stats?.total ?? 0}
        description="All time bookings"
        icon={<Car className="h-6 w-6 text-primary" />}
      />
    </div>
  );
} 