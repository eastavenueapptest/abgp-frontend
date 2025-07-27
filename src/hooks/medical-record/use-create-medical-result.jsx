import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useCreateMedicalResult = (requestBody) => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const createResult = async () => {
      try {
        setIsLoading(true);
        const formattedData = JSON.stringify(
          Array.isArray(requestBody)
            ? Object.assign({}, ...requestBody)
            : requestBody
        );
        const response = await fetch(`${server}/api/medical-test-results`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: formattedData,
        });

        if (!response.ok) {
          throw new Error("Failed to create Medical Result");
        }

        const result = await response.json();
        toast.success("Record Successfully created");
        setData(result);
        navigate("../scanned-result");
      } catch (error) {
        setError(error.message);
        toast.success("Record Failed to create");
      } finally {
        setIsLoading(false);
      }
    };

    if (
      requestBody &&
      (typeof requestBody === "object" || Array.isArray(requestBody))
    ) {
      createResult();
    }
  }, [requestBody, server]);

  return { data, isLoading, error };
};

export default useCreateMedicalResult;
