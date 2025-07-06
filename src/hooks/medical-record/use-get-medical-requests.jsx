import { useEffect, useState } from "react";
const useGetMedicalRequest = () => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${server}/api/medical-test-request
`);
        if (!response.ok) {
          throw new Error("Failed to fetch Medical Request");
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
  }, []);
  return { data, isLoading, error };
};

export default useGetMedicalRequest;
