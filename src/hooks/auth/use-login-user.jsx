import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";

export const useLoginUser = (requestBody) => {
  const server = process.env.REACT_APP_SERVER;
  const { refresh } = useAuthContext();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const inputResult = async () => {
      try {
        setIsLoading(true);
        const formattedData = JSON.stringify(
          Array.isArray(requestBody)
            ? Object.assign({}, ...requestBody)
            : requestBody
        );
        const response = await fetch(`${server}/api/users/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: formattedData,
        });

        if (!response.ok) {
          throw new Error("Failed to Login Account");
        }
        const result = await response.json();
        // console.log(result);
        sessionStorage.setItem("user", JSON.stringify(result.data));
        toast.success("User is now Logged in");
        setData(result);

        await refresh();

        navigate("/dashboard");
      } catch (error) {
        setError(error.message);
        toast.success("Wrong Credentials");
      } finally {
        setIsLoading(false);
      }
    };

    if (
      requestBody &&
      (typeof requestBody === "object" || Array.isArray(requestBody))
    ) {
      inputResult();
    }
  }, [requestBody, refresh]); // Add refresh as a dependency

  return { data, isLoading, error };
};

export default useLoginUser;
