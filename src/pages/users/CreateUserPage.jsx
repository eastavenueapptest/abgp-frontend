import { useState } from "react";
import useGetSession from "../../hooks/auth/use-session-user";
import useGetPositions from "../../hooks/position/use-get-positions";
import useCreateUser from "../../hooks/users/use-create-user";
import SimpleForm from "../../shared-components/fields/SimpleForm";

const CreateUsertPage = () => {
  const { data: session } = useGetSession();
  const [input, setInput] = useState(null);
  const { data: positions, isLoading: isPositionLoading } = useGetPositions();
  const { isLoading: isUsersLoading } = useCreateUser(input);
  const items = [
    { textLabel: "Employee Name", type: "text", name: "employeeName" },
    { textLabel: "Employee Number", type: "number", name: "employeeNumber" },
    { textLabel: "Username", type: "text", name: "username" },
    { textLabel: "Password", type: "password", name: "password" },
    {
      textLabel: "Role",
      type: "dropdown",
      name: "positionId",
      options: positions?.map(({ id, type }) => ({
        id,
        label: type,
        value: id,
      })),
    },
  ];

  const handleSubmit = (value) => {
    const newValue = value?.map((item) => {
      if (["position"].some((keyword) => item.label.includes(keyword))) {
        item.value = item.value.value;
      }
      return { [item.label]: item.value };
    });

    const finalData = {
      ...newValue.reduce((acc, item) => ({ ...acc, ...item }), {}),
      requestor: session?.user?.id,
    };
    setInput(finalData);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <SimpleForm
            title={"Create User"}
            items={items}
            isLoading={isPositionLoading || isUsersLoading}
            onSubmit={(formData) => handleSubmit(formData)}
            returnTo={"/users"}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateUsertPage;
