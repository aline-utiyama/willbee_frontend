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
      Welcome to your dashboard! <button onClick={handleLogout}>Logout</button>;
    </div>
  );
};

export default Dashboard;
