import { useParams } from "react-router-dom";

import useGetPositions from "../../hooks/position/use-get-positions";
import useEditUser from "../../hooks/users/use-edit-user";
import useGetUser from "../../hooks/users/use.get-user";
import SimpleViewForm from "../../shared-components/fields/SimpleViewForm";

const ViewUserPage = () => {
  const { id } = useParams();
  const { editUser, isLoading: isEditUserLoading } = useEditUser(id);

  const { data: user, isLoading: isGetUserLoading } = useGetUser(id);

  user?.map(
    ({ employee_name, employee_number, username, password, position_id }) => ({
      employee_name,
      employee_number,
      username,
      password,
      position_id,
    })
  );

  const handleSubmit = (formData) => {
    editUser(id, formData);
  };
  const { data: position } = useGetPositions();

  const jobOptions = position.map(({ id, type }) => {
    return { id, label: type, value: id };
  });

  const items = [
    { name: "employee_name", label: "Employee Name", type: "text" },
    { name: "employee_number", label: "Employee Number", type: "number" },
    { name: "username", label: "Username", type: "text" },
    { name: "password", label: "Password", type: "password" },
    {
      name: "position_id",
      label: "Job Position",
      type: "autocomplete",
      options: jobOptions,
    },
  ];
  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <SimpleViewForm
            title={"Users Info"}
            items={user}
            onSubmit={handleSubmit}
            onDelete={(data) => console.log("Delete", data)}
            isLoading={isEditUserLoading || isGetUserLoading}
            returnTo={"../users"}
            fields={items}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewUserPage;
