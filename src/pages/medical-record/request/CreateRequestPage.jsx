import { useState } from "react";
import useGetSession from "../../../hooks/auth/use-session-user";
import useCreateMedicalRequest from "../../../hooks/medical-record/use-create-medical-request";
import useGetPhysicianDoctor from "../../../hooks/users/use-get-physician-doctor";
import SimpleForm from "../../../shared-components/fields/SimpleForm";

const CreateRequestPage = () => {
  const { data: session } = useGetSession();
  const [input, setInput] = useState(null);
  const { isLoading: isRequestLoading } = useCreateMedicalRequest(input);

  const { data: doctors, isLoading: isDoctorListsLoading } =
    useGetPhysicianDoctor();
  const items = [
    { textLabel: "Patient Name", type: "text", name: "patientName" },
    { textLabel: "Age", type: "number", name: "age" },
    {
      textLabel: "Sex",
      type: "dropdown",
      name: "sex",
      options: [
        { id: 1, label: "Male", value: "M" },
        { id: 2, label: "Female", value: "F" },
      ],
    },
    { textLabel: "Diagnosis", type: "text", name: "diagnosis", maxLength: 20 },
    {
      textLabel: "Assign Physician",
      type: "dropdown",
      name: "physician",
      options: doctors?.map(({ id, employee_name }) => ({
        id,
        label: employee_name,
        value: id,
      })),
    },
    { textLabel: "Ward", type: "text", name: "ward" },
    { textLabel: "Fio2 Route", type: "text", name: "fio2Route" },
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
