import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useCreateUser = (requestBody) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const server = process.env.REACT_APP_SERVER;

  useEffect(() => {
    const createRequest = async () => {
      try {
        setIsLoading(true);

        const formattedData = JSON.stringify(
          Array.isArray(requestBody)
            ? Object.assign({}, ...requestBody)
            : requestBody
        );

        const response = await fetch(`${server}/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: formattedData,
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result);
          toast.warning(result?.message ?? "Failed to create User");
          return;
        }

        toast.success("Record successfully created");
        setData(result);
        navigate("/users");
      } catch (err) {
        console.error("Error creating user:", err);
        setError(err.message);
        toast.error("Record failed to create");
      } finally {
        setIsLoading(false);
      }
    };

    if (
      requestBody &&
      (typeof requestBody === "object" || Array.isArray(requestBody))
    ) {
      createRequest();
    }
  }, [requestBody, server, navigate]);

  return { data, isLoading, error };
};

export default useCreateUser;
