import { useAdminStats } from "@/hooks/useAdminStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { UsersTable } from "./UsersTable";
import { DriversTable } from "./DriversTable";
import { VehiclesTable } from "./VehiclesTable";
import { BookingsTable } from "./BookingsTable";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { 
  UsersIcon, 
  TruckIcon, 
  CalendarIcon, 
  ShieldCheckIcon,
  BanknotesIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { StatsCard } from "@/components/admin/StatsCard";
import { format } from 'date-fns';
import { Suspense } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function AdminDashboard() {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    console.error('Error fetching admin stats:', error);
    return <div>Error loading stats</div>;
  }

  if (!stats) {
    return <DashboardSkeleton />;
  }

  // Now stats is definitely defined
  const chartData = {
    bookings: stats.trends.bookings ?? [],
    revenue: stats.trends.revenue ?? [],
    incidents: stats.trends.incidents ?? []
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Users"
          value={stats?.users.total ?? 0}
          description={`${stats?.users.newThisWeek ?? 0} new this week`}
          icon={<UsersIcon className="h-6 w-6" />}
        />
        <StatsCard
          title="Active Drivers"
          value={stats?.drivers.available || 0}
          description={`${stats?.drivers.total} total drivers`}
          icon={<TruckIcon className="h-6 w-6" />}
        />
        <StatsCard
          title="Pending Bookings"
          value={stats?.bookings.pending || 0}
          description={`${stats?.bookings.total} total bookings`}
          icon={<CalendarIcon className="h-6 w-6" />}
        />
        <StatsCard
          title="Revenue This Month"
          value={stats?.revenue.thisMonth || 0}
          isCurrency
          description={`${formatCurrency(stats?.revenue.lastMonth || 0)} last month`}
          icon={<BanknotesIcon className="h-6 w-6" />}
        />
        <StatsCard
          title="Incidents"
          value={stats?.incidents.pending || 0}
          description={`${stats?.incidents.total} total incidents`}
          icon={<ShieldCheckIcon className="h-6 w-6" />}
        />
        <StatsCard
          title="Active Users Today"
          value={stats?.users.activeToday || 0}
          description="Users logged in today"
          icon={<ChartBarIcon className="h-6 w-6" />}
        />
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <ChartCard
              title="Booking Trends"
              data={chartData.bookings}
              dataKey="count"
              color="#2563eb"
            />
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <ChartCard
              title="Revenue Trends"
              data={chartData.revenue}
              dataKey="amount"
              color="#16a34a"
              isCurrency
            />
          </TabsContent>

          <TabsContent value="incidents" className="space-y-4">
            <ChartCard
              title="Incident Trends"
              data={chartData.incidents}
              dataKey="count"
              color="#dc2626"
            />
          </TabsContent>
        </Tabs>
      </Suspense>
    </motion.div>
  );
}

// Extract chart into a separate component for better organization
interface ChartCardProps {
  title: string;
  data: any[];
  dataKey: string;
  color: string;
  isCurrency?: boolean;
}

function ChartCard({ title, data, dataKey, color, isCurrency }: ChartCardProps) {
  const formatChartDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d');
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateStr;
    }
  };

  const formatTooltipDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'PPP');
    } catch (error) {
      console.error('Tooltip date formatting error:', error);
      return dateStr;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatChartDate}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={formatTooltipDate}
              formatter={(value: number) => [
                isCurrency ? formatCurrency(value) : value,
                isCurrency ? 'Revenue' : 'Count'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(6).fill(null).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-48 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px]" />
        </CardContent>
      </Card>
    </div>
  );
} 