import { useEffect, useState } from "react";

const useGetUser = (userId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const server = process.env.REACT_APP_SERVER;

    const fetchRequest = async () => {
      try {
        const response = await fetch(`${server}/api/users/current/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user");
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
  }, [userId, server]);

  return { data, isLoading, error };
};

export default useGetUser;
