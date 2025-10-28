import { useState } from "react";
import useGetSession from "../../../hooks/auth/use-session-user";
import useCreateMedicalRequest from "../../../hooks/medical-record/use-create-medical-request";
import useGetPhysicianDoctor from "../../../hooks/users/use-get-physician-doctor";
import SimpleForm from "../../../shared-components/fields/SimpleForm";

const CreateRequestPage = () => {
  const { data: session } = useGetSession();
  const [input, setInput] = useState(null);
  const { isLoading: isRequestLoading, error } = useCreateMedicalRequest(input);
  console.log("x", error);
  const { data: doctors, isLoading: isDoctorListsLoading } =
    useGetPhysicianDoctor();
  const items = [
    {
      textLabel: "Patient Name",
      type: "text",
      name: "patientName",
      errorMessage: error?.errorFields?.patientName,
      maxLength: 50,
    },
    {
      textLabel: "Age",
      type: "number",
      name: "age",
      errorMessage: error?.errorFields?.age,
      maxLength: 3,
    },
    {
      textLabel: "Sex",
      type: "dropdown",
      name: "sex",
      errorMessage: error?.errorFields?.sex,
      options: [
        { id: 1, label: "Male", value: "M" },
        { id: 2, label: "Female", value: "F" },
      ],
    },
    {
      textLabel: "Diagnosis",
      type: "text",
      name: "diagnosis",
      errorMessage: error?.errorFields?.diagnosis,
      maxLength: 50,
    },
    {
      textLabel: "Assign Physician",
      type: "dropdown",
      name: "physician",
      errorMessage: error?.errorFields?.physician,
      options: doctors?.map(({ id, employee_name }) => ({
        id,
        label: employee_name,
        value: id,
      })),
    },
    {
      textLabel: "Ward",
      type: "text",
      name: "ward",
      errorMessage: error?.errorFields?.ward,
      maxLength: 50,
    },
    {
      textLabel: "Fio2 Route",
      type: "text",
      name: "fio2Route",
      errorMessage: error?.errorFields?.fio2Route,
      maxLength: 50,
    },
  ];

  const handleSubmit = (value) => {
    const newValue = value?.map((item) => {
      if (
        ["physician", "sex"].some((keyword) => item.label.includes(keyword))
      ) {
        item.value = item.value.value;
      }
      return { [item.label]: item.value };
    });

    const finalData = {
      ...newValue.reduce((acc, item) => ({ ...acc, ...item }), {}),
      requestor: session?.user?.id,
    };
    console.log(finalData);
    setInput(finalData);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <SimpleForm
            title={"Create Request"}
            items={items}
            isLoading={isRequestLoading || isDoctorListsLoading}
            onSubmit={(formData) => handleSubmit(formData)}
            returnTo={"request"}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateRequestPage;
