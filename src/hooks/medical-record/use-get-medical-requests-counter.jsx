import { useEffect, useState } from "react";

const useGetCountRequests = ({ from, to }) => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (from) query.append("from", from);
        if (to) query.append("to", to);

        const response = await fetch(
          `${server}/api/medical-test-request/count-requests?${query.toString()}`
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
    };

    fetchData();
  }, [server, from, to]);

  return { data, isLoading, error };
};

export default useGetCountRequests;
