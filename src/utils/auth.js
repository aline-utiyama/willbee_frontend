import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);
};

`import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "../services/api"; // Ensure this is set up to handle your API requests

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState(null); // Store user info
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Fetch user info using the token
        const response = await API.get("/auth/me", {
          headers: {
            Authorization: "Bearer $ {token}",
          },
        });

        setUser(response.data.user); // Set user info
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { user, loading };
};`;
