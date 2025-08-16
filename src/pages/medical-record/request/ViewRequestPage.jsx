import { useParams } from "react-router-dom";
import useGetMedicalRequest from "../../../hooks/medical-record/use-get-medical-request";

import useEditMedicalRequest from "../../../hooks/medical-record/use-edit-medical-request";
import useGetPhysicianDoctor from "../../../hooks/users/use-get-physician-doctor";
import SimpleViewForm from "../../../shared-components/fields/SimpleViewForm";

const ViewRequestPage = () => {
  const { id } = useParams();
  const { data: physicians } = useGetPhysicianDoctor();

  const { editRequest, isLoading: isEditRequestLoading } =
    useEditMedicalRequest();

  const { data: medReq, isLoading: isGetRequestLoading } =
    useGetMedicalRequest(id);
  medReq?.map(
    ({
      patient_name,
      age,
      sex,
      diagnosis,
      physician_id,
      fio2_route,
      status,
    }) => ({
      patient_name,
      age,
      sex,
      diagnosis,
      physician_id,
      fio2_route,
      status,
    })
  );
  const sexOptions = [
    { id: 1, label: "Male", value: "M" },
    { id: 2, label: "Female", value: "F" },
  ];
  const handleSubmit = (formData) => {
    editRequest(id, formData);
  };
  const physicianOptions =
    physicians?.map(({ id, employee_name }) => ({
      id,
      label: employee_name,
      value: id,
    })) || [];

  const items = [
    { name: "patient_name", label: "Patient Name", type: "text" },
    { name: "age", label: "Age", type: "number" },
    { name: "diagnosis", label: "Diagnosis", type: "text" },
    {
      name: "sex",
      label: "Sex",
      type: "autocomplete",
      options: sexOptions,
    },
    {
      name: "physician_id",
      label: "Assigned Physician Doctor",
      type: "autocomplete",
      options: physicianOptions,
    },
    { name: "fio2_route", label: "Fio2 Route", type: "text" },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <SimpleViewForm
            title="Patient Info"
            items={medReq}
            onSubmit={handleSubmit}
            onDelete={(data) => console.log("Delete", data)}
            isLoading={isGetRequestLoading || isEditRequestLoading}
            returnTo={"request"}
            fields={items}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewRequestPage;
