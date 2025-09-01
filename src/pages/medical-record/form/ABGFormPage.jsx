import { Button, TextField } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import useCreateEmail from "../../../hooks/email/use-create-email";
import useEditMedicalResult from "../../../hooks/medical-record/use-edit-medical-result";
import useEditStatusRequest from "../../../hooks/medical-record/use-edit-status-medical-requests";
import useGetMedicalResult from "../../../hooks/medical-record/use-get-medical-result";
import useGetMedicalResults from "../../../hooks/medical-record/use-get-medical-results";
import useGetPhysicianDoctor from "../../../hooks/users/use-get-physician-doctor";
import SimpleAutoCompleteInput from "../../../shared-components/fields/SimpleAutoCompleteInput";
import SimpleForm from "../../../shared-components/fields/SimpleViewForm";
import SimpleModal from "../../../shared-components/modals/SimpleModal";
import ResultForm from "../components/ResultForm";
import StatusList from "../components/StatusList";

const ABGFormPage = () => {
  const now = moment().utcOffset(8).format("YYYY-MM-DDTHH:mm");

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [date, setDate] = useState({
    from: now,
    to: now,
  });

  const [selectedResultId, setSelectedResultId] = useState(null);
  const [fields, setFields] = useState(null);
  const resultFormRef = useRef();
  const { sendEmail } = useCreateEmail();
  const { editStatusRequest } = useEditStatusRequest();
  const {
    data: resultsQuery,
    isLoading: resultIsLoading,
    refetch: refetchMedicalResults,
  } = useGetMedicalResults({
    from: date.from,
    to: date.to,
  });
  const { data: userPhysicianQuery, isLoading: isPhysicianDoctorLoading } =
    useGetPhysicianDoctor();
  const { data: specificResultQuery, isLoading: specificResulIsLoading } =
    useGetMedicalResult(selectedResultId);

  const { editMedicalResult, isLoading: isEditResultLoading } =
    useEditMedicalResult();

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

  const handleComplete = () => {
    editStatusRequest(specificResultQuery?.request_id, {
      status: 3,
    });
    setTimeout(() => {
      refetchMedicalResults();
      setSelectedResultId(null);
    }, [2000]);
  };

  const handleSendEmail = () => {
    sendEmail({ id: selectedResultId });
  };

  const handleUpdateInterpretation = (formData) => {
    editMedicalResult(selectedResultId, formData);
    setTimeout(() => {
      refetchMedicalResults();
      setSelectedResultId(null);
    }, 2000);
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

          <div className="mb-3">
            <TextField
              size="small"
              label="Date From"
              type="datetime-local"
              value={date?.from}
              fullWidth
              onChange={(e) =>
                setDate((prev) => ({ ...prev, from: e.target.value }))
              }
              slotProps={{
                textField: {
                  InputLabelProps: { shrink: true },
                  size: "small",
                },
              }}
            />
          </div>
          <div className="mb-3">
            <TextField
              size="small"
              label="Date To"
              type="datetime-local"
              value={date?.to}
              fullWidth
              onChange={(e) =>
                setDate((prev) => ({ ...prev, to: e.target.value }))
              }
              slotProps={{
                textField: {
                  InputLabelProps: { shrink: true },
                  size: "small",
                },
              }}
            />
          </div>
          <div className="mb-3">
            <SimpleAutoCompleteInput
              data={patientName}
              label="Patient name"
              value={selectedPatient}
              onChange={(event, newValue) => setSelectedPatient(newValue)}
              getOptionLabel={(option) => option.patient_name}
            />
          </div>
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
              date={"results_date_created_formatted"}
              longText={"diagnosis"}
              items={filteredResults}
            />
          </div>
        )}
      </div>

      <div className="col-lg-8 col-md-8 col-sm-12 col-12 border p-3">
        {selectedResultId && (
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
            {specificResultQuery?.status === 2 && (
              <div className="flex-shrink-1">
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "capitalize",
                  }}
                  disabled={specificResulIsLoading}
                  onClick={handleComplete}
                >
                  Mark as Complete
                </Button>
              </div>
            )}
            {specificResultQuery?.status === 3 && (
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
            )}
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
        )}
        <div className="border  mb-3 d-flex align-items-center">
          {specificResulIsLoading || selectedResultId == null ? (
            <div className="w-100 d-flex justify-content-center">
              {" "}
              <label className="m-auto p-2 text-secondary">
                Please select a result.
              </label>
            </div>
          ) : (
            <div
              ref={resultFormRef}
              className="w-100"
              style={{ padding: 0, margin: 0 }}
            >
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
                  hco3: fields?.HCO3,
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
