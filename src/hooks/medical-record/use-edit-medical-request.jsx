import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useEditMedicalRequest = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const server = process.env.REACT_APP_SERVER;

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

      const result = await response.json();

      if (!response.ok) {
        setError(result);
        toast.warning(result?.message ?? "Failed to create User");
        return;
      }
      toast.success("Record Successfully updated");
      setData(result);
      setTimeout(() => {
        navigate("../request");
      }, [2000]);
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
