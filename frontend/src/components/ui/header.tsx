import { useAuthStore } from '@/stores/useAuthStore';

export function Header() {
  const user = useAuthStore(state => state.user);

  return (
    <header className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.firstName} {user?.lastName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your bookings and activity
        </p>
      </div>
    </header>
  );
} 