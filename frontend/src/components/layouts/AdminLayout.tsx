import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "@/components/layouts/AdminHeader";
import { LogoutButton } from '@/components/LogoutButton';

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        <div className="mt-auto p-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
} 