import useGetMedicalRequest from "../../../hooks/medical-record/use-get-medical-requests";
import SimpleTable from "../../../shared-components/tables/SimpleTable";
import { formatStatus } from "../../../utils/formatStatus";

const columns = [
  { id: "id", label: "ID" },
  { id: "patient_name", label: "Name" },
  { id: "date_created", label: "Date" },
  { id: "status", label: "Status" },
];

const RequestPage = () => {
  const { data: testRequests = [], isLoading } = useGetMedicalRequest();

  const rows = testRequests.map(({ status, ...rest }) => ({
    status: formatStatus(status),
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
