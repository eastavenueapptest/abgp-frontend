import { useEffect, useState } from "react";

const useGetSession = () => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log(server);
      try {
        // Simulating session fetch from storage
        const user = sessionStorage.getItem("user");
        if (user) {
          setData({ user: JSON.parse(user) });
        } else {
          throw new Error("No session found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [server]);

  // If you still want to expose a manual refresh
  const refresh = async () => {
    try {
      const user = sessionStorage.getItem("user");
      if (user) {
        setData({ user: JSON.parse(user) });
      } else {
        throw new Error("No session found");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, refresh, error };
};

export default useGetSession;
