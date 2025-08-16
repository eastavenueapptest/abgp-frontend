import { useEffect, useState } from "react";
const useGetMachineDevice = () => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${server}/api/machines
`);
        if (!response.ok) {
          throw new Error("Failed to fetch Machine Device");
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

export default useGetMachineDevice;
