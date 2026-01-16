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
  const { editUser, isLoading: isEditUserLoading, error } = useEditUser(id);
  const { deleteUser } = useDeleteUser(id);

  const { data: user, isLoading: isGetUserLoading } = useGetUser(id);
  const formattedUser = user?.map(
    ({
      employee_name,
      employee_number,
      username,
      position_id,
      is_deleted,
      email_address,
    }) => ({
      employeeName: employee_name,
      employeeNumber: employee_number,
      username,
      positionId: position_id,
      is_deleted,
      emailAddress: email_address,
    })
  );
  const currentUser = formattedUser?.[0];
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
    { name: "employeeName", label: "Employee Name", type: "text" },
    { name: "emailAddress", label: "Email Address", type: "email" },
    { name: "username", label: "Username", type: "text" },
  ];
  const items = [
    {
      name: "employeeName",
      label: "Employee Name",
      type: "text",
      errorMessage: error?.errorFields?.employeeName,
    },
    {
      name: "employeeNumber",
      label: "Employee Number",
      type: "number",
      errorMessage: error?.errorFields?.employeeNumber,
    },
    {
      name: "emailAddress",
      label: "Email Address",
      type: "email",
      errorMessage: error?.errorFields?.emailAddress,
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      errorMessage: error?.errorFields?.username,
    },
    {
      name: "positionId",
      label: "Job Position",
      type: "autocomplete",
      errorMessage: error?.errorFields?.positionId,
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
                {currentUser?.positionId === 5 && (
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
            items={formattedUser}
            onSubmit={handleSubmit}
            onDelete={
              currentUser?.is_deleted !== 0 || currentUser?.positionId === 5
                ? null
                : handleDelete
            }
            isLoading={isEditUserLoading || isGetUserLoading}
            returnTo={"../users"}
            fields={currentUser?.positionId === 5 ? adminItems : items}
            showSubmit={
              currentUser?.is_deleted === 1 || currentUser?.positionId === 5
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
