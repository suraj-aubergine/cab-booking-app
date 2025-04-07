import { DataTable } from "@/components/admin/DataTable";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Booking {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  pickup: {
    address: string;
  };
  drop: {
    address: string;
  };
  scheduledTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "user.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <div className="font-medium">
          {row.original.user.firstName} {row.original.user.lastName}
        </div>
        <div className="text-sm text-muted-foreground">
          {row.original.user.email}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "pickup.address",
    header: "Pickup",
  },
  {
    accessorKey: "drop.address",
    header: "Drop",
  },
  {
    accessorKey: "scheduledTime",
    header: "Scheduled For",
    cell: ({ row }) => format(new Date(row.getValue("scheduledTime")), "PPp"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={
            status === "COMPLETED"
              ? "text-green-600"
              : status === "CANCELLED"
              ? "text-red-600"
              : status === "CONFIRMED"
              ? "text-blue-600"
              : "text-yellow-600"
          }
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Booked On",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "PP"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Update status</DropdownMenuItem>
            <DropdownMenuItem>Contact user</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function BookingsTable() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data } = await api.get('/admin/bookings');
      return data.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={bookings || []}
      searchKey="user.email"
    />
  );
} 