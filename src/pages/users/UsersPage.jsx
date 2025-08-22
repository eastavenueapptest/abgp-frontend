import useGetUsers from "../../hooks/users/use-get-users";
import SimpleTable from "../../shared-components/tables/SimpleTable";
import { formatActiveStatus } from "../../utils/formatActiveStatus";

const columns = [
  { id: "employee_name", label: "Name" },
  { id: "employee_number", label: "Employee Number" },
  { id: "position_name", label: "Position" },
  { id: "is_deleted", label: "Status" },
];

const UsersPage = () => {
  const { data: users, isLoading } = useGetUsers();
  const rows = users.map(({ is_deleted, ...rest }) => ({
    is_deleted: formatActiveStatus(is_deleted),
    ...rest,
  }));
  return (
    <div className="container">
      <div className="row  ">
        <div className="col-12 p-0 mt-3">
          <SimpleTable
            columns={columns}
            rows={isLoading ? [] : rows}
            title="Users Information"
            enableCreateFunction={true}
            enableUpdatePasswordFunction={true}
            enableRowAction={true}
          />
        </div>
      </div>
    </div>
  );
};
export default UsersPage;
