import { useEffect, useState } from "react";

const useGetMedicalRequest = (requestId) => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!requestId) return;

    const fetchRequest = async () => {
      try {
        const response = await fetch(
          `${server}/api/medical-test-request/${requestId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch medical request");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [requestId]);

  return { data, isLoading, error };
};

export default useGetMedicalRequest;
