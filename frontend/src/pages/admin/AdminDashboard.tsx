import { useAdminStats } from "@/hooks/useAdminData";
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
  ShieldCheckIcon 
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

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

function StatsCard({ title, value, icon: Icon, subtitle, colorClass }: any) {
  return (
    <motion.div variants={item}>
      <Card className={cn("overflow-hidden transition-all hover:scale-[1.02]", colorClass)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          <div className={cn("rounded-full p-2 bg-background/10")}>
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp end={value} duration={2} />
          </div>
          {subtitle && (
            <p className="text-xs opacity-70">
              {subtitle}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return <div className="space-y-4">
      <Skeleton className="h-[20px] w-[150px]" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[125px]" />
        <Skeleton className="h-[125px]" />
        <Skeleton className="h-[125px]" />
        <Skeleton className="h-[125px]" />
      </div>
    </div>;
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
          Admin Dashboard
        </h1>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats?.users.total}
          icon={UsersIcon}
          subtitle={`${stats?.users.newThisWeek} new this week`}
          colorClass="bg-blue-500/10 text-blue-500"
        />
        <StatsCard
          title="Active Drivers"
          value={stats?.drivers?.available || 0}
          icon={TruckIcon}
          subtitle={`${stats?.drivers?.total || 0} total drivers`}
          colorClass="bg-green-500/10 text-green-500"
        />
        <StatsCard
          title="Active Bookings"
          value={stats?.bookings.pending}
          icon={CalendarIcon}
          subtitle={`${stats?.bookings.total} total bookings`}
          colorClass="bg-purple-500/10 text-purple-500"
        />
        <StatsCard
          title="Safety Incidents"
          value={stats?.incidents?.total || 0}
          icon={ShieldCheckIcon}
          subtitle={`${stats?.incidents?.pending || 0} pending resolution`}
          colorClass="bg-orange-500/10 text-orange-500"
        />
      </div>

      {/* Charts */}
      <motion.div
        variants={item}
        className="grid gap-4 md:grid-cols-2"
      >
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-600">Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.trends.bookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  stroke="#64748b"
                />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-600">Safety & Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.trends.incidents}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  stroke="#64748b"
                />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#22c55e' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Tables */}
      <motion.div variants={item}>
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px] bg-muted/50">
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="drivers"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Drivers
            </TabsTrigger>
            <TabsTrigger 
              value="vehicles"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              Vehicles
            </TabsTrigger>
            <TabsTrigger 
              value="bookings"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UsersTable />
          </TabsContent>

          <TabsContent value="drivers" className="space-y-4">
            <DriversTable />
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4">
            <VehiclesTable />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <BookingsTable />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
} 