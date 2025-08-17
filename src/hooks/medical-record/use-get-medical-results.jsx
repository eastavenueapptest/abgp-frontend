import { useCallback, useEffect, useState } from "react";

const useGetMedicalResults = ({ from, to }) => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (from) query.append("from", from);
      if (to) query.append("to", to);

      const response = await fetch(
        `${server}/api/medical-test-results?${query.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Medical Results");
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [server, from, to]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

export default useGetMedicalResults;
