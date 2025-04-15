import { useAdminStats } from "@/hooks/useAdminStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersTable } from "./UsersTable";
import { DriversTable } from "./DriversTable";
import { VehiclesTable } from "./VehiclesTable";
import { BookingsTable } from "./BookingsTable";
import { motion } from "framer-motion";
import { 
  UsersIcon, 
  TruckIcon, 
  CalendarIcon, 
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { StatsCard } from "@/components/admin/StatsCard";
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
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <select className="rounded-lg border px-3 py-2 bg-background">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
          <button className="rounded-lg border px-3 py-2 hover:bg-accent">
            <ArrowTrendingUpIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Users"
          value={stats?.users.total}
          description={`${stats?.users.newThisWeek} new this week`}
          icon={<UsersIcon className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Active Drivers"
          value={stats?.drivers.available}
          description={`${stats?.drivers.total} total drivers`}
          icon={<TruckIcon className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Total Bookings"
          value={stats?.bookings.total}
          description={`${stats?.bookings.pending} pending`}
          icon={<CalendarIcon className="h-6 w-6 text-primary" />}
        />
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, i) => (
              <motion.div 
                key={i}
                variants={item}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New booking #1234</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-4 w-24 mt-4" />
              <Skeleton className="h-8 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px]" />
        </CardContent>
      </Card>
    </div>
  );
} 