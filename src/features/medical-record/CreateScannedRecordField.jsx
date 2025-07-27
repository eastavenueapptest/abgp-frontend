import TextField from "@mui/material/TextField";
import { useCallback, useEffect, useState } from "react";

const CreateScannedRecordField = ({ data, onSubmit }) => {
  const [fields, setFields] = useState([
    { fieldName: "pH", targetText: ["ph"], currentValue: "-" },
    { fieldName: "pCO2", targetText: ["pcO", "pc0"], currentValue: "-" },
    { fieldName: "PO2", targetText: ["po", "p0"], currentValue: "-" },
    { fieldName: "HCO3", targetText: ["hco", "hc0"], currentValue: "-" },
    { fieldName: "TCO2", targetText: ["tco", "tc0"], currentValue: "-" },
    { fieldName: "BE", targetText: ["be", "be(b)"], currentValue: "-" },
    { fieldName: "SO2", targetText: ["so", "s0"], currentValue: "-" },
    { fieldName: "FIO2", targetText: ["flo", "fl0"], currentValue: "-" },
  ]);
  const handleFirstNumber = (value) => {
    const parts = value
      .split(" ")
      .filter((word) => !isNaN(word) && word.trim() !== "");
    return parts.length > 0 ? Number(parts[0]) : "-";
  };

  const assignValuesToFields = useCallback(() => {
    if (data && data.length > 0) {
      setFields((prevFields) =>
        prevFields.map((field) => {
          const match = field.targetText.find((target) =>
            data.some((extracted) =>
              extracted.toLowerCase().includes(target.toLowerCase())
            )
          );

          if (match && field.currentValue === "-") {
            const matchedExtractedText = data.find((extracted) =>
              extracted.toLowerCase().includes(match.toLowerCase())
            );

            if (matchedExtractedText) {
              const filteredValue = handleFirstNumber(matchedExtractedText);
              return { ...field, currentValue: filteredValue };
            }
          }

          return field;
        })
      );
    }
  }, [data]);

  useEffect(() => {
    assignValuesToFields();
  }, [assignValuesToFields]);

  useEffect(() => {
    if (fields.length > 0) {
      onSubmit(fields);
    }
  }, [fields, onSubmit]);

  const handleFieldChange = (index, value) => {
    setFields((prevFields) =>
      prevFields.map((field, i) =>
        i === index ? { ...field, currentValue: value } : field
      )
    );
  };

  return (
    <div>
      {fields.map((field, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <TextField
            fullWidth
            label={field.fieldName}
            variant="outlined"
            value={field.currentValue}
            onChange={(e) => handleFieldChange(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default CreateScannedRecordField;
