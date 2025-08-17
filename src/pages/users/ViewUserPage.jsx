import { useNavigate, useParams } from "react-router-dom";

import useGetPositions from "../../hooks/position/use-get-positions";
import useDeleteUser from "../../hooks/users/use-delete-user";
import useEditUser from "../../hooks/users/use-edit-user";
import useGetUser from "../../hooks/users/use.get-user";
import SimpleViewForm from "../../shared-components/fields/SimpleViewForm";

const ViewUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editUser, isLoading: isEditUserLoading } = useEditUser(id);
  const { deleteUser } = useDeleteUser(id);

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

  const handleDelete = () => {
    console.log("ok");
    deleteUser(id, { is_deleted: true });

    setTimeout(() => {
      navigate("/users");
    }, [2000]);
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
            onDelete={handleDelete}
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
