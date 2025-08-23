import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";

export const useLogoutUser = () => {
  const server = process.env.REACT_APP_SERVER;
  const { refresh } = useAuthContext(); // Access refresh to update AuthContext
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${server}/api/users/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to logout of the Account");
      }

      await refresh();

      toast.success("Logging you out");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError(error.message);
      toast.error("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
};

export default useLogoutUser;
