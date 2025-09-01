import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import imagePlaceholder from "../../../assets/images/placeholders/image.jpg";
import CreateScannedRecordField from "../../../features/medical-record/CreateScannedRecordField";
import { useAuthContext } from "../../../hooks/context/AuthContext";
import useCreateMedicalResult from "../../../hooks/medical-record/use-create-medical-result";

import useGetMachineDevice from "../../../hooks/medical-record/use-get-machine-devices";
import useGetMedicalRequest from "../../../hooks/medical-record/use-get-medical-requests";
import useOCR from "../../../hooks/medical-record/use-ocr";
import SimpleAutoCompleteInput from "../../../shared-components/fields/SimpleAutoCompleteInput";

const ScannedResultPage = () => {
  const { data: requests, isLoading: isGetRequestLoading } =
    useGetMedicalRequest();
  const { data: machines, isLoading: isMachineLoading } = useGetMachineDevice();
  const { isProcessing, ocrResult, handleOCR } = useOCR();

  const [image, setImage] = useState(null);
  const [hasImage, setHasImage] = useState(false);

  const [scannedFields, setScannedFields] = useState(null);
  const [input, setInput] = useState(null);
  const [result, setResult] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const { isLoading: isRequestLoading } = useCreateMedicalResult(input);

  const patientName = useMemo(() => {
    return requests
      ?.filter((item) => item.status === 1)
      .map(({ id, patient_name }) => ({
        id,
        patient_name,
      }));
  }, [requests]);

  const machineName = useMemo(() => {
    return machines.map(({ id, machine_name }) => ({
      id,
      machine_name,
    }));
  }, [machines]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      setHasImage(true);
    }
  };

  const handleIsDetermined = (event) => {
    setSelectedValue(event.target.value);
  };

  const { user } = useAuthContext();
  const employee = user?.user;

  const handleSubmit = () => {
    const abgFields = {};
    scannedFields?.forEach((item) => {
      abgFields[item.fieldName] = item.currentValue;
    });
    setInput({
      requestId: selectedPatient?.id,
      rtId: employee?.id,
      machineId: selectedMachine?.id,
      extractedText: abgFields,
      isDetermined: Number(selectedValue),
    });

    if (!isGetRequestLoading) {
      setTimeout(() => {
        handleClear();
      }, [2000]);
    }
    if (!isMachineLoading) {
      setTimeout(() => {
        handleClear();
      }, [2000]);
    }
  };

  const handleClear = () => {
    setImage(null);
    setResult([]);
    setHasImage(false);
    setScannedFields(null);
    setInput(null);
    setSelectedPatient(null);
    setSelectedMachine(null);
    document.getElementById("imageInput").value = "";
  };

  useEffect(() => {
    if (ocrResult) {
      setResult(ocrResult);
    }
  }, [ocrResult]);

  if (isGetRequestLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="row">
      <div className="col-lg-4 col-md-12 col-sm-12 col-12">
        <div className="border p-3">
          <div className="py-2">
            <h5>Image Preview</h5>
          </div>
          <form
            className="d-flex flex-column"
            onSubmit={(e) => e.preventDefault()}
          >
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <img
                className="img img-thumbnail"
                src={image ? image : imagePlaceholder}
                alt="Uploaded"
                onClick={() => document.getElementById("imageInput").click()}
                style={{ cursor: "pointer" }}
              />
            </div>

            <div className="d-flex gap-3 mt-3">
              <Button
                type="button"
                variant="outlined"
                sx={{
                  textTransform: "capitalize",
                }}
                disabled={!image && result.length === 0 && !selectedPatient}
                onClick={handleClear}
              >
                Clear
              </Button>
              <Button
                type="button"
                variant={hasImage ? "contained" : "outlined"}
                sx={{
                  textTransform: "capitalize",
                }}
                onClick={() => document.getElementById("imageInput").click()}
              >
                Upload
              </Button>
              <Button
                type="button"
                variant="contained"
                sx={{
                  textTransform: "capitalize",
                }}
                disabled={isProcessing || !image}
                onClick={() => handleOCR(image)}
              >
                {isProcessing ? "Processing..." : "Scan Result"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="col-lg-8 col-md-12 col-sm-12 col-12">
        <div className="row border py-3 mb-3 align-items-center px-2">
          <div className="col-lg-6 p-2">
            <SimpleAutoCompleteInput
              data={patientName}
              label="Patient name"
              value={selectedPatient}
              onChange={(event, newValue) => setSelectedPatient(newValue)}
              getOptionLabel={(option) =>
                `${option.patient_name} (#${option.id})`
              }
            />
          </div>
          <div className="col-lg-6 p-2">
            <SimpleAutoCompleteInput
              data={machineName}
              label="Machine"
              value={selectedMachine}
              onChange={(event, newValue) => setSelectedMachine(newValue)}
              getOptionLabel={(option) => `${option.machine_name}`}
            />
          </div>
          <div className="col-lg-12 p-2">
            <div className="d-flex justify-content-between p-0">
              <RadioGroup
                row
                value={selectedValue}
                onChange={handleIsDetermined}
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="Determined"
                />
                <FormControlLabel
                  value={2}
                  control={<Radio />}
                  label="Extracted"
                />
              </RadioGroup>

              <Button
                type="button"
                variant="contained"
                disabled={
                  result?.length === 0 ||
                  !selectedPatient?.id ||
                  !selectedMachine?.id ||
                  selectedValue === null
                }
                onClick={handleSubmit}
                sx={{
                  textTransform: "capitalize",
                }}
              >
                Approve Result
              </Button>
            </div>
          </div>
        </div>

        {result.length > 0 && !isRequestLoading && (
          <div className="border p-3 mb-3">
            <h3>OCR Result:</h3>
            <CreateScannedRecordField
              data={result}
              onSubmit={(value) => setScannedFields(value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannedResultPage;
