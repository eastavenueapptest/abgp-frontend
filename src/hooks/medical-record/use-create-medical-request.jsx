import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useCreateMedicalRequest = (requestBody) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const server = process.env.REACT_APP_SERVER;

  useEffect(() => {
    const createRequest = async () => {
      try {
        setIsLoading(true);
        const formattedData = JSON.stringify(
          Array.isArray(requestBody)
            ? Object.assign({}, ...requestBody)
            : requestBody
        );
        const response = await fetch(`${server}/api/medical-test-request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: formattedData,
        });
        const result = await response.json();

        if (!response.ok) {
          setError(result);
          toast.warning(result?.message ?? "Failed to create medical request");
          return;
        }

        const formData = new FormData();
        formData.append("patientName", formattedData.patientName);

        fetch(
          "https://script.google.com/macros/s/AKfycbz49BTqBw4hmCZUnLF4leWj2nUGel4_R7VzXMQ-zusc7Gi02Z1bEgeJKEe8VDxocbtf/exec",
          {
            method: "POST",
            body: formData,
          }
        )
          .then((res) => res.json())
          .then(console.log)
          .catch(console.error);

        toast.success("Record Successfully created");
        setData(result);
        navigate("../request");
      } catch (error) {
        setError(error.message);
        toast.warning("Record Failed to create");
      } finally {
        setIsLoading(false);
      }
    };

    if (
      requestBody &&
      (typeof requestBody === "object" || Array.isArray(requestBody))
    ) {
      createRequest();
    }
  }, [requestBody, server, navigate]);

  return { data, isLoading, error };
};

export default useCreateMedicalRequest;
