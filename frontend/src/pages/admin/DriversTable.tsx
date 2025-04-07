import { DataTable } from "@/components/admin/DataTable";
import { useDriversList } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Driver {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  licenseNumber: string;
  licenseExpiry: string;
  isAvailable: boolean;
}

const columns: ColumnDef<Driver>[] = [
  {
    accessorKey: "user.firstName",
    header: "First Name",
  },
  {
    accessorKey: "user.lastName",
    header: "Last Name",
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "licenseNumber",
    header: "License Number",
  },
  {
    accessorKey: "isAvailable",
    header: "Status",
    cell: ({ row }) => (
      <span className={row.getValue("isAvailable") ? "text-green-600" : "text-red-600"}>
        {row.getValue("isAvailable") ? "Available" : "Busy"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const driver = row.original;

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
            <DropdownMenuItem>Edit driver</DropdownMenuItem>
            <DropdownMenuItem>View trips</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DriversTable() {
  const { data: drivers, isLoading } = useDriversList();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={drivers || []}
      searchKey="user.email"
    />
  );
} 