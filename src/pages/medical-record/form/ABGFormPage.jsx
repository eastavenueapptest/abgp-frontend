import { useCallback, useEffect, useMemo, useState } from "react";
import useGetMedicalResult from "../../../hooks/medical-record/use-get-medical-result";
import useGetMedicalResults from "../../../hooks/medical-record/use-get-medical-results";
import useGetPhysicianDoctor from "../../../hooks/users/use-get-physician-doctor";
import SimpleAutoCompleteInput from "../../../shared-components/fields/SimpleAutoCompleteInput";
import ResultForm from "../components/ResultForm";
import StatusList from "../components/StatusList";

const ABGFormPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [fields, setFields] = useState(null);

  const { data: resultsQuery, isLoading: resultIsLoading } =
    useGetMedicalResults();
  const { data: userPhysicianQuery } = useGetPhysicianDoctor();
  const { data: specificResultQuery, isLoading: specificResulIsLoading } =
    useGetMedicalResult(selectedResultId);
  const patientName = useMemo(() => {
    return resultsQuery
      ?.filter((item) => item.status > 0)
      .map(({ id, patient_name }) => ({ id, patient_name }));
  }, [resultsQuery]);

  const employees = useMemo(() => {
    return userPhysicianQuery?.map(({ id, employee_name }) => ({
      id,
      employee_name,
    }));
  }, [userPhysicianQuery]);

  const filteredResults = useMemo(() => {
    if (!selectedPatient?.patient_name) return resultsQuery;
    return resultsQuery?.filter(
      (e) => e.patient_name === selectedPatient.patient_name
    );
  }, [resultsQuery, selectedPatient]);

  const handlePreviewForm = useCallback(
    (id) => {
      setSelectedResultId(id);
    },
    [selectedResultId]
  );

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
          <div className="border p-3">
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
            <button className="btn btn-primary">Print </button>
          </div>
          <div className="flex-shrink-1">
            <button className="btn btn-primary">Email to Department </button>
          </div>
        </div>
        <div className=" mb-3 d-flex align-items-center gap-3">
          <div className="flex-fill">
            <SimpleAutoCompleteInput
              data={employees}
              label="Intepreted by"
              value={selectedEmployee}
              onChange={(event, newValue) => setSelectedEmployee(newValue)}
              getOptionLabel={(option) => option.employee_name}
            />
          </div>
        </div>

        <div className="border p-3 mb-3 d-flex align-items-center gap-3">
          {specificResulIsLoading ? (
            "No Preview"
          ) : (
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
                hco3: fields?.HCO3,
                sao2: fields?.SO2,
                ctco2: fields?.TCO2,
                interpreted_by: selectedEmployee?.employee_name,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ABGFormPage;
