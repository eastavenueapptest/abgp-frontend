import { useState } from "react";
import { toast } from "react-toastify";

const useDeleteUser = () => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = async (userId, updateData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${server}/api/users/current/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update Users");
      }

      const result = await response.json();
      setData(result);
      toast.success("Record Successfully Deleted");
    } catch (err) {
      setError(err.message);
      toast.warning("Record Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteUser, data, isLoading, error };
};

export default useDeleteUser;
