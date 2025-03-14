"use client";

import { createContext, useContext, useEffect, useState } from "react";
import railsAPI from "@/services/rails-api";
import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await railsAPI.get(`/users/settings`);
        setUser(response.data.user);
      } catch (error) {
        logout(() => router.push("/login"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
