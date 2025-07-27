import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useCreateMedicalRequest = (requestBody) => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const createRequest = async () => {
      try {
        setIsLoading(true);
        const formattedData = JSON.stringify(
          Array.isArray(requestBody)
            ? Object.assign({}, ...requestBody)
            : requestBody
        );
        const response = await fetch(`${server}/api/medical-test-request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: formattedData,
        });

        if (!response.ok) {
          throw new Error("Failed to create Medical Request");
        }

        const result = await response.json();
        toast.success("Record Successfully created");
        setData(result);
        navigate("../request");
      } catch (error) {
        setError(error.message);
        toast.warning("Record Failed to create");
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
  }, [requestBody, server]);

  return { data, isLoading, error };
};

export default useCreateMedicalRequest;
