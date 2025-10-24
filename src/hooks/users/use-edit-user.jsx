import { useState } from "react";
import { toast } from "react-toastify";

const useEditUser = () => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const editUser = async (userId, updateData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${server}/api/users/current/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result);
        toast.warning(result?.message ?? "Failed to create User");
        return;
      }
      toast.success("Record Successfully updated");
      setData(result);
    } catch (err) {
      setError(err.message);
      toast.warning("Record Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  return { editUser, data, isLoading, error };
};

export default useEditUser;
