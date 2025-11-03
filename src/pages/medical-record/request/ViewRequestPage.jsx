import { useNavigate, useParams } from "react-router-dom";
import useDeleteRequest from "../../../hooks/medical-record/use-delete-medical-request";
import useEditMedicalRequest from "../../../hooks/medical-record/use-edit-medical-request";
import useGetMedicalRequest from "../../../hooks/medical-record/use-get-medical-request";
import useGetPhysicianDoctor from "../../../hooks/users/use-get-physician-doctor";
import SimpleViewForm from "../../../shared-components/fields/SimpleViewForm";
import { formatActiveStatus } from "../../../utils/formatActiveStatus";
import { formatStatus } from "../../../utils/formatStatus";

const ViewRequestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: physicians } = useGetPhysicianDoctor();
  const { deleteRequest } = useDeleteRequest(id);

  const {
    editRequest,
    isLoading: isEditRequestLoading,
    error,
  } = useEditMedicalRequest();

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
      is_deleted,
      ward,
    }) => ({
      patient_name,
      age,
      sex,
      diagnosis,
      physician_id,
      fio2_route,
      status,
      is_deleted,
      ward,
    })
  );

  const currentRequest = medReq?.[0];
  const sexOptions = [
    { id: 1, label: "Male", value: "M" },
    { id: 2, label: "Female", value: "F" },
  ];
  const handleSubmit = (formData) => {
    editRequest(id, formData);
  };
  const handleDelete = () => {
    deleteRequest(id, { is_deleted: true });
    setTimeout(() => {
      navigate("/medical-records/request");
    }, [2000]);
  };

  const physicianOptions =
    physicians?.map(({ id, employee_name }) => ({
      id,
      label: employee_name,
      value: id,
    })) || [];

  const items = [
    {
      name: "patient_name",
      label: "Patient Name",
      type: "text",
      errorMessage: error?.errorFields?.patientName,
    },
    {
      name: "age",
      label: "Age",
      type: "number",
      errorMessage: error?.errorFields?.age,
    },
    {
      name: "diagnosis",
      label: "Diagnosis",
      type: "text",
      errorMessage: error?.errorFields?.diagnosis,
    },
    {
      name: "sex",
      label: "Sex",
      type: "autocomplete",
      options: sexOptions,
      errorMessage: error?.errorFields?.sex,
    },
    {
      name: "physician_id",
      label: "Assigned Physician Doctor",
      type: "autocomplete",
      options: physicianOptions,
      errorMessage: error?.errorFields?.physician,
    },
    {
      textLabel: "Ward",
      label: "Ward",
      type: "text",
      name: "ward",
      errorMessage: error?.errorFields?.ward,
    },
    {
      name: "fio2_route",
      label: "Fio2 Route",
      type: "text",
      errorMessage: error?.errorFields?.fio2Route,
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <SimpleViewForm
            title={
              <div>
                Patient Info {formatStatus(currentRequest?.status)}{" "}
                {formatActiveStatus(currentRequest?.is_deleted)}
              </div>
            }
            items={medReq}
            onSubmit={handleSubmit}
            onDelete={
              currentRequest?.is_deleted === 0 && currentRequest?.status === 1
                ? handleDelete
                : null
            }
            isLoading={isGetRequestLoading || isEditRequestLoading}
            returnTo={"request"}
            fields={items}
            showSubmit={
              currentRequest?.is_deleted === 1 || currentRequest?.status > 1
                ? false
                : true
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ViewRequestPage;
