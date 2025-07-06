import { useRef, useState } from "react";
import Tesseract from "tesseract.js";

const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const isProcessingRef = useRef(false);
  const handleOCR = async (image) => {
    if (!image) {
      alert("Please capture or upload an image first!");
      return;
    }

    if (isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      const result = await Tesseract.recognize(image, "eng");
      const extractedText = result?.data.text.split("\n");

      setOcrResult(extractedText);
    } catch (error) {
      setOcrResult("Failed to extract text.");
    } finally {
      setIsProcessing(false);
      isProcessingRef.current = false;
    }
  };

  return {
    isProcessing,
    ocrResult,
    handleOCR,
  };
};

export default useOCR;
