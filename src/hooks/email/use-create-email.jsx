import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useCreateEmail = () => {
  const server = process.env.REACT_APP_SERVER;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const sendEmail = async (payload) => {
    try {
      setIsLoading(true);
      const formattedData = JSON.stringify(payload);

      const response = await fetch(`${server}/api/emails/send-abg-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formattedData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to send Email");
      }

      const result = await response.json();
      toast.success("Email successfully sent");
      setData(result);
      navigate("/medical-records/abg-form");
    } catch (error) {
      setError(error.message);
      toast.warning("Email failed to send");
    } finally {
      setIsLoading(false);
    }
  };

  return { sendEmail, data, isLoading, error };
};

export default useCreateEmail;
