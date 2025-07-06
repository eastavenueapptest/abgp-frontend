import { useState } from "react";
import { toast } from "react-toastify";

const useChangePassword = () => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const changePassword = async (userId, body) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `${server}/api/users/change-password/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update Users");
      }

      const result = await response.json();
      setData(result);
      toast.success("Record Successfully updated");
    } catch (err) {
      setError(err.message);
      toast.success("Record Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  return { changePassword, data, isLoading, error };
};

export default useChangePassword;
