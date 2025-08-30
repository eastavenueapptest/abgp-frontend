import useGetMedicalRequest from "../../../hooks/medical-record/use-get-medical-requests";
import SimpleTable from "../../../shared-components/tables/SimpleTable";
import { formatActiveStatus } from "../../../utils/formatActiveStatus";
import { formatStatus } from "../../../utils/formatStatus";

const columns = [
  { id: "id", label: "ID" },
  { id: "patient_name", label: "Name" },
  { id: "date_created_formatted", label: "Date" },
  { id: "status", label: "Document Status" },
  { id: "is_deleted", label: "Active Status" },
];

const RequestPage = () => {
  const { data: testRequests = [], isLoading } = useGetMedicalRequest();

  const rows = testRequests.map(({ status, is_deleted, ...rest }) => ({
    status: formatStatus(status),
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
            title="Patient Information"
            enableCreateFunction={true}
            enableRowAction={true}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestPage;
