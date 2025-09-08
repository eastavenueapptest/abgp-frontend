import { useNavigate, useParams } from "react-router-dom";

import { Chip } from "@mui/material";
import useGetPositions from "../../hooks/position/use-get-positions";
import useDeleteUser from "../../hooks/users/use-delete-user";
import useEditUser from "../../hooks/users/use-edit-user";
import useGetUser from "../../hooks/users/use.get-user";
import SimpleViewForm from "../../shared-components/fields/SimpleViewForm";
import { formatActiveStatus } from "../../utils/formatActiveStatus";

const ViewUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editUser, isLoading: isEditUserLoading } = useEditUser(id);
  const { deleteUser } = useDeleteUser(id);

  const { data: user, isLoading: isGetUserLoading } = useGetUser(id);

  user?.map(
    ({
      employee_name,
      employee_number,
      username,
      password,
      position_id,
      is_deleted,
      email_address,
    }) => ({
      employee_name,
      employee_number,
      username,
      password,
      position_id,
      is_deleted,
      email_address,
    })
  );
  const currentUser = user?.[0];
  const handleSubmit = (formData) => {
    editUser(id, formData);
  };

  const handleDelete = () => {
    deleteUser(id, { is_deleted: true });
    setTimeout(() => {
      navigate("/users");
    }, [2000]);
  };
  const { data: position } = useGetPositions();

  const jobOptions = position.map(({ id, type }) => {
    return { id, label: type, value: id };
  });
  const adminItems = [
    { name: "employee_name", label: "Employee Name", type: "text" },
    { name: "email_address", label: "Email Address", type: "email" },
    { name: "username", label: "Username", type: "text" },
  ];
  const items = [
    { name: "employee_name", label: "Employee Name", type: "text" },
    { name: "employee_number", label: "Employee Number", type: "number" },
    { name: "email_address", label: "Email Address", type: "email" },
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
      <div></div>
      <div className="row">
        <div className="col-6">
          <SimpleViewForm
            title={
              <div>
                User Info {formatActiveStatus(currentUser?.is_deleted)}{" "}
                {currentUser?.position_id === 5 && (
                  <Chip
                    label={"Admin Account Limited Info"}
                    color="default"
                    size="small"
                    variant="contained"
                    sx={{ p: 1 }}
                  />
                )}
              </div>
            }
            items={user}
            onSubmit={handleSubmit}
            onDelete={
              currentUser?.is_deleted !== 0 || currentUser?.position_id === 5
                ? null
                : handleDelete
            }
            isLoading={isEditUserLoading || isGetUserLoading}
            returnTo={"../users"}
            fields={currentUser?.position_id === 5 ? adminItems : items}
            showSubmit={
              currentUser?.is_deleted === 1 || currentUser?.position_id === 5
                ? false
                : true
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ViewUserPage;
