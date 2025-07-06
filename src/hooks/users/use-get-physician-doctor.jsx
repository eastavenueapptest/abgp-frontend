import { useEffect, useState } from "react";
const useGetPhysicianDoctor = () => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${server}/api/users/assignee-for-physician`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
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
  }, [server]);
  return { data, isLoading, error };
};

export default useGetPhysicianDoctor;
