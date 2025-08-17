import { useState } from "react";
import { toast } from "react-toastify";

const useEditMedicalRequest = () => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const editRequest = async (requestId, updateData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `${server}/api/medical-test-request/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update medical request");
      }

      const result = await response.json();
      setData(result);
      toast.success("Record Successfully updated");
    } catch (err) {
      setError(err.message);
      toast.warning("Record Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  return { editRequest, data, isLoading, error };
};

export default useEditMedicalRequest;
