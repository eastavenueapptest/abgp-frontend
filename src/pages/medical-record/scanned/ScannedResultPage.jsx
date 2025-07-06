import { useEffect, useMemo, useState } from "react";
import imagePlaceholder from "../../../assets/images/placeholders/image.jpg";
import CreateScannedRecordField from "../../../features/medical-record/CreateScannedRecordField";
import useGetSession from "../../../hooks/auth/use-session-user";
import { useAuthContext } from "../../../hooks/context/AuthContext";
import useCreateMedicalResult from "../../../hooks/medical-record/use-create-medical-result";
import useGetMedicalRequest from "../../../hooks/medical-record/use-get-medical-requests";
import useOCR from "../../../hooks/medical-record/use-ocr";
import SimpleAutoCompleteInput from "../../../shared-components/fields/SimpleAutoCompleteInput";

const ScannedResultPage = () => {
  const { data: requests, isLoading } = useGetMedicalRequest();
  const { data: session } = useGetSession();
  const { isProcessing, ocrResult, handleOCR } = useOCR();

  const [image, setImage] = useState(null);
  const [scannedFields, setScannedFields] = useState(null);
  const [input, setInput] = useState(null);
  const [result, setResult] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const {
    data,
    isLoading: isRequestLoading,
    error,
  } = useCreateMedicalResult(input);

  const patientName = useMemo(() => {
    return requests
      ?.filter((item) => item.status == 0)
      .map(({ id, patient_name }) => ({
        id,
        patient_name,
      }));
  }, [requests]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { user } = useAuthContext();
  const employee = user?.user;

  const handleSubmit = () => {
    const abgFields = {};
    scannedFields?.forEach((item) => {
      abgFields[item.fieldName] = item.currentValue;
    });
    setInput({
      requestId: selectedPatient.id,
      rtId: employee?.id,
      extractedText: abgFields,
    });
  };

  const handleClear = () => {
    setImage(null);
    setResult([]);
    setScannedFields(null);
    setInput(null);
    setSelectedPatient(null);
    document.getElementById("imageInput").value = "";
  };

  useEffect(() => {
    if (ocrResult) {
      setResult(ocrResult);
    }
  }, [ocrResult]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row">
      <div className="col-lg-4 col-md-4 col-sm-12 col-12">
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
              <button
                className="btn btn-light border"
                disabled={!image && result.length === 0 && !selectedPatient}
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                type="button"
                className="btn btn-light border"
                onClick={() => document.getElementById("imageInput").click()}
              >
                Upload
              </button>
              <button
                className="btn btn-primary"
                disabled={isProcessing || !image}
                onClick={() => handleOCR(image)}
              >
                {isProcessing ? "Processing..." : "Scan Result"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="col-lg-8 col-md-8 col-sm-12 col-12">
        <div className="border p-3 mb-3 d-flex align-items-center gap-3">
          <div className="flex-fill">
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
          <div className="flex-shrink-1">
            <button
              className="btn btn-primary"
              disabled={!result}
              onClick={handleSubmit}
            >
              Approve Result
            </button>
          </div>
        </div>

        {result.length > 0 && (
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
