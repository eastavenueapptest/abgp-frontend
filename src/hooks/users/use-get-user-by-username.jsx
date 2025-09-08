import { useEffect, useState } from "react";

const useGetUserByUsername = (username) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const server = process.env.REACT_APP_SERVER;

  useEffect(() => {
    if (!username) return;

    const fetchRequest = async () => {
      try {
        const response = await fetch(
          `${server}/api/emails/generate-secrey-key/${username}`
        );
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
  }, [username, server]);

  return { data, isLoading, error };
};

export default useGetUserByUsername;
