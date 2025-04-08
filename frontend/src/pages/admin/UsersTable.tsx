import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DataTable } from "@/components/admin/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { 
  UserPlus,
  Search,
  MoreHorizontal, 
  Pencil,
  Trash2,
  Mail,
  Building,
  UserCircle,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { UserRole } from "@/types/auth";
import { AddUserDialog } from "@/components/admin/AddUserDialog";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
            <AvatarFallback>{getInitials(`${user.firstName} ${user.lastName}`)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.firstName} {user.lastName}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as UserRole;
      const badgeVariants: Record<UserRole, "default" | "destructive" | "secondary" | "outline"> = {
        ADMIN: "destructive",
        MANAGER: "default",
        EMPLOYEE: "secondary",
        DRIVER: "outline"
      };
      return (
        <Badge variant={badgeVariants[role]}>
          {role.charAt(0) + role.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const department = row.getValue("department") as string;
      return (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span>{department || "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-2 text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: usersData,
    isLoading,
    isError,
    error
  } = useQuery<UsersResponse>({
    queryKey: ['users', searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await api.get<UsersResponse>(`/users?${params}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load users</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <AddUserDialog />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[250px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={usersData?.data.users || []}
            searchKey="email"
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
} 