import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "@/components/layouts/AdminHeader";
import { LogoutButton } from '@/components/LogoutButton';
import { Toaster } from "@/components/ui/toaster";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-col lg:pl-72">
        <AdminHeader />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <div className="mt-auto p-4">
          <LogoutButton />
        </div>
      </div>
      <Toaster />
    </div>
  );
} 