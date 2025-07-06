import useGetUsers from "../../hooks/users/use-get-users";
import SimpleTable from "../../shared-components/tables/SimpleTable";

const columns = [
  { id: "employee_name", label: "Name" },
  { id: "employee_number", label: "Employee Number" },
  { id: "position_name", label: "Position" },
];

const UsersPage = () => {
  const { data: users, isLoading } = useGetUsers();
  return (
    <div className="container">
      <div className="row  ">
        <div className="col-12 p-0 mt-3">
          <SimpleTable
            columns={columns}
            rows={isLoading ? [] : users}
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
