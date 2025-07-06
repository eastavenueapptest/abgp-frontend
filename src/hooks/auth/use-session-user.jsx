import { useEffect, useState } from "react";

const useGetSession = () => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    console.log(server);
    try {
      // const response = await fetch(`${server}/api/users/session`, {
      //   credentials: "include",
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to fetch session");
      // }

      // const result = await response.json();
      // console.log("result: ", result);
      const user = sessionStorage.getItem("user");
      console.log(user.id);
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
