"use client";
import { useRouter } from "next/navigation";
import { logout } from "../actions/auth.js";

const Dashboard = () => {
  const router = useRouter();

  const handleLogout = async () => {
    logout(() => {
      router.push("/login"); // Redirect after session is destroyed
    });
  };

  return (
    <div>
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          Welcome to your dashboard!
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
