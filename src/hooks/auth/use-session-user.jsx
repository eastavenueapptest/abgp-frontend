import { useEffect, useState } from "react";

const useGetSession = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    try {
      const user = localStorage.getItem("user");
      setData({ user: JSON.parse(user) });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, refresh: fetchData, error };
};

export default useGetSession;
