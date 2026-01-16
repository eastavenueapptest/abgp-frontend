import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";

export const useResetpasswordKey = () => {
  const server = process.env.REACT_APP_SERVER;
  const { refresh } = useAuthContext();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const resetPassword = async (requestBody) => {
    try {
      setIsLoading(true);

      const formattedData = JSON.stringify(
        Array.isArray(requestBody)
          ? Object.assign({}, ...requestBody)
          : requestBody
      );
      const objectData = JSON.parse(formattedData);
      if (objectData.key == "" || objectData.password == "")
        throw new Error("Fill up missing fields");
      if (
        objectData.password &&
        !/^(?=.*[@._-])[A-Za-z0-9@._-]+$/.test(objectData.password)
      )
        throw new Error(
          "At least one special character required. Allowed: @ - _ ."
        );
      console.log("test");
      const response = await fetch(`${server}/api/users/setup-new-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: formattedData,
      });
      console.log(formattedData);
      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      const result = await response.json();
      setData(result);

      toast.success("Password updated successfully");
      await refresh();

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError(error.message);
      toast.error("Wrong credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return { resetPassword, data, isLoading, error };
};

export default useResetpasswordKey;
