import { Button } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import useCreateEmail from "../../../hooks/email/use-create-email";
import useEditMedicalResult from "../../../hooks/medical-record/use-edit-medical-result";
import useGetMedicalResult from "../../../hooks/medical-record/use-get-medical-result";
import useGetMedicalResults from "../../../hooks/medical-record/use-get-medical-results";
import useGetPhysicianDoctor from "../../../hooks/users/use-get-physician-doctor";
import SimpleAutoCompleteInput from "../../../shared-components/fields/SimpleAutoCompleteInput";
import SimpleForm from "../../../shared-components/fields/SimpleViewForm";
import SimpleModal from "../../../shared-components/modals/SimpleModal";
import ResultForm from "../components/ResultForm";
import StatusList from "../components/StatusList";

const ABGFormPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [selectedResultId, setSelectedResultId] = useState(null);
  const [fields, setFields] = useState(null);
  const resultFormRef = useRef();
  const { sendEmail } = useCreateEmail();

  const { data: resultsQuery, isLoading: resultIsLoading } =
    useGetMedicalResults();
  const { data: userPhysicianQuery, isLoading: isPhysicianDoctorLoading } =
    useGetPhysicianDoctor();
  const { data: specificResultQuery, isLoading: specificResulIsLoading } =
    useGetMedicalResult(selectedResultId);

  const { editMedicalResult, isLoading: isEditResultLoading } =
    useEditMedicalResult(selectedResultId);

  const patientName = useMemo(() => {
    return resultsQuery
      ?.filter((item) => item.status > 0)
      .map(({ id, patient_name }) => ({ id, patient_name }));
  }, [resultsQuery]);

  const physicianOptions = useMemo(() => {
    return userPhysicianQuery?.map(({ id, employee_name }) => ({
      id,
      label: employee_name,
      value: employee_name,
    }));
  }, [userPhysicianQuery]);

  const items = [
    {
      name: "interpreted_by",
      label: "Interpreted by",
      type: "autocomplete",
      options: physicianOptions,
    },
    { name: "interpreted_message", label: "Interpreted message", type: "text" },
  ];

  const filteredResults = useMemo(() => {
    if (!selectedPatient?.patient_name) return resultsQuery;
    return resultsQuery?.filter(
      (e) => e.patient_name === selectedPatient.patient_name
    );
  }, [resultsQuery, selectedPatient]);

  const handlePreviewForm = (id) => {
    console.log(id);
    setSelectedResultId(id);
  };

  const handlePrint = () => {
    const printContents = resultFormRef.current.innerHTML;
    const printWindow = window.open("", "_self");

    const styles = `
    <style>
      @media print {
        @page {
          size: 8.3in 5.8in; 
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          max-width: 100%;
        }
        body {
          font-family: Arial, sans-serif;
          box-sizing: border-box;
          max-width: 100%;
          padding: 0;
          width: 8.3in;
          height: 5.8in;
          display: block !important;
        }
        .abg-form-result{
          border: none !important;
          margin: auto;
          padding 0 2em;
        }
      }
      body{
        display: none;
      }

    </style>
  `;

    printWindow.document.write("<html><head><title>Print Result</title>");
    printWindow.document.write(styles);
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContents);
    printWindow.document.write("</body></html>");
    printWindow.document.close();

    printWindow.focus();
    printWindow.print();

    // Optional: let the user close it manually if you comment this out
    printWindow.close();
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSendEmail = () => {
    sendEmail(selectedResultId);
  };

  const handleUpdateInterpretation = (formData) => {
    editMedicalResult(selectedResultId, formData);
  };
  useEffect(() => {
    if (specificResultQuery) {
      setFields(JSON.parse(specificResultQuery?.extracted_text));
    }
  }, [specificResultQuery]);
  if (resultIsLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="row">
      <div className="col-lg-4 col-md-4 col-sm-12 col-12">
        <div className="border p-3 mb-3">
          <div className="py-2">
            <h5>Search Patient</h5>
          </div>
          <SimpleAutoCompleteInput
            data={patientName}
            label="Patient"
            value={selectedPatient}
            onChange={(event, newValue) => setSelectedPatient(newValue)}
            getOptionLabel={(option) => option.patient_name}
          />
        </div>

        {filteredResults.length > 0 && (
          <div
            className="border p-3"
            style={{ maxHeight: "50vh", overflowY: "auto" }}
          >
            <StatusList
              onhandlePreview={handlePreviewForm}
              label={"patient_name"}
              status={"status"}
              date={"date_text"}
              longText={"diagnosis"}
              items={filteredResults}
            />
          </div>
        )}
      </div>

      <div className="col-lg-8 col-md-8 col-sm-12 col-12 border p-3">
        <div className="mb-3 d-flex align-items-center gap-3">
          <div className="flex-shrink-1">
            <Button
              variant="contained"
              sx={{
                textTransform: "capitalize",
              }}
              disabled={specificResulIsLoading}
              onClick={handlePrint}
            >
              Print {specificResulIsLoading}
            </Button>
          </div>

          <div className="flex-shrink-1">
            <Button
              variant="contained"
              sx={{
                textTransform: "capitalize",
              }}
              disabled={specificResulIsLoading}
              onClick={handleSendEmail}
            >
              Email to Department{" "}
            </Button>
          </div>

          <div className="flex-shrink-1">
            <SimpleModal
              open={isModalOpen}
              onOpen={handleOpenModal}
              onClose={handleCloseModal}
              body={
                !specificResulIsLoading &&
                specificResultQuery && (
                  <div className="mb-3 px-3">
                    <SimpleForm
                      subtitle={`Update patient ${specificResultQuery?.patient_name}'s result Interpretation`}
                      fields={items}
                      defaultValues={{
                        interpreted_by: specificResultQuery?.interpreted_by,
                        interpreted_message:
                          specificResultQuery?.interpreted_message,
                      }}
                      onSubmit={(formData) => {
                        handleUpdateInterpretation(formData);
                        handleCloseModal();
                      }}
                      isLoading={
                        isEditResultLoading || isPhysicianDoctorLoading
                      }
                    />
                  </div>
                )
              }
            />
          </div>
        </div>

        <div className="border  mb-3 d-flex align-items-center">
          {specificResulIsLoading ? (
            "No Preview"
          ) : (
            <div ref={resultFormRef} style={{ padding: 0, margin: 0 }}>
              <ResultForm
                defaultValues={{
                  prepared_by: specificResultQuery?.respiratory_therapists,
                  name: specificResultQuery?.patient_name || "",
                  ageGender:
                    `${specificResultQuery?.age} / ${specificResultQuery?.sex}` ??
                    "",
                  ward: "",
                  diagnosis: specificResultQuery?.diagnosis,
                  physician: specificResultQuery?.physician_doctor,
                  time: "",
                  temp: "",
                  hgb: fields?.HGB,
                  fio2: fields?.FIO2,
                  pH: fields?.pH,
                  pco2: fields?.pCO2,
                  po2: fields?.PO2,
                  hco3: fields?.HC03,
                  be: fields?.BE,
                  sao2: fields?.SO2,
                  ctco2: fields?.TCO2,
                  interpreted_by: specificResultQuery?.interpreted_by,
                  mixed: specificResultQuery?.interpreted_message,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ABGFormPage;
