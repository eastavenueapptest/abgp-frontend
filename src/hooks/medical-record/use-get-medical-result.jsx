import { useEffect, useState } from "react";
const server = process.env.REACT_APP_SERVER;

const useGetMedicalResult = (resultId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resultId) return;

    const fetchRequest = async () => {
      try {
        const response = await fetch(
          `${server}/api/medical-test-results/view-medical-report-form/${resultId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch medical result");
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
  }, [resultId]);

  return { data, isLoading, error };
};

export default useGetMedicalResult;
