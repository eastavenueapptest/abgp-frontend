import { Check, FolderOpen, Search } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { useCallback, useState } from "react";
import useGetMachineDevice from "../../hooks/medical-record/use-get-machine-devices";
import useGetCountRequests from "../../hooks/medical-record/use-get-medical-requests-counter";
import useGetMedicalResults from "../../hooks/medical-record/use-get-medical-results";
import SimpleCardCounter from "../../shared-components/cards/SimpleCardCounter";

const OverviewPage = () => {
  const datetime = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState({
    from: datetime,
    to: datetime,
  });

  const { data: requestsCountQuery } = useGetCountRequests({
    from: date.from,
    to: date.to,
  });

  const totalResultCollected = requestsCountQuery?.filter((item) =>
    [2, 3].includes(item.status)
  );

  const totalForReview = requestsCountQuery?.filter(
    (item) => item.status === 2
  );
  const totalCompleted = requestsCountQuery?.filter(
    (item) => item.status === 3
  );
  const { data: resultsQuery, isLoading: resultIsLoading } =
    useGetMedicalResults({
      from: date.from,
      to: date.to,
    });
  const { data: machineQuery } = useGetMachineDevice();
  const renderRow = useCallback(
    (item, index) => {
      const abgResult = JSON.parse(item?.extracted_text);
      const machineName = machineQuery.find(
        (machine) => machine.id === item.machine_id
      );
      return (
        <tr key={index}>
          <td className="align-middle">{item?.request_id}</td>
          <td className="align-middle">{item?.date_created_formatted}</td>
          <td className="align-middle">{machineName?.machine_name}</td>
          <td className="align-middle">{item?.timeReceiver}</td>
          <td className="align-middle">{item?.extracted}</td>
          <td className="align-middle">{item?.determined}</td>
          <td>{item?.patient_name}</td>
          <td className="align-middle">{item?.age}</td>
          <td className="align-middle">{item?.sex}</td>
          <td className="align-middle">{item?.fio2_route}</td>
          <td className="align-middle">{abgResult?.pH}</td>
          <td className="align-middle">{abgResult?.pCO2}</td>
          <td className="align-middle">{abgResult?.PO2}</td>
          <td className="align-middle">{abgResult?.HCO3}</td>
          <td className="align-middle">{abgResult?.BE}</td>
          <td className="align-middle">{abgResult?.SO2 ?? "-"}</td>
          <td className="align-middle">{abgResult?.TCO2 ?? "-"}</td>
          <td className="align-middle">{item?.respiratory_therapists}</td>
          <td className="align-middle">{item?.timeRelease}</td>
          <td className="align-middle">{item?.renderedTime}</td>
        </tr>
      );
    },
    [machineQuery]
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 p-2">
          <SimpleCardCounter
            icon={<FolderOpen />}
            counterValue={totalResultCollected?.length ?? 0}
            title={"Total Result Collected"}
          />
        </div>
        <div className="col-2 p-2">
          <SimpleCardCounter
            icon={<Search />}
            counterValue={totalForReview?.length ?? 0}
            title={"For Review"}
          />
        </div>
        <div className="col-2 p-2">
          <SimpleCardCounter
            icon={<Check />}
            counterValue={totalCompleted?.length ?? 0}
            title={"Completed"}
          />
        </div>
        <div className="col-6 p-2">
          <div className="row  p-4">
            <div className="col-12">
              <div className="d-flex align-items-center gap-2 ">
                <TextField
                  label="Date From"
                  type="date"
                  value={date?.from}
                  fullWidth
                  onChange={(e) =>
                    setDate((prev) => ({ ...prev, from: e.target.value }))
                  }
                  slotProps={{
                    textField: {
                      InputLabelProps: { shrink: true },
                      size: "small",
                    },
                  }}
                />{" "}
                <TextField
                  label="Date To"
                  type="date"
                  value={date?.to}
                  fullWidth
                  onChange={(e) =>
                    setDate((prev) => ({ ...prev, to: e.target.value }))
                  }
                  slotProps={{
                    textField: {
                      InputLabelProps: { shrink: true },
                      size: "small",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12  overflow-auto bg-white  table-responsive p-0">
          <table className="table table-bordered census-table text-center p-0">
            <thead>
              <tr>
                <th>DATE</th>
                <th>
                  <small className="fw-normal">
                    from <br /> {date.from} <br /> to <br /> {date.to}
                  </small>
                </th>
                <th
                  rowSpan={6}
                  colSpan={18}
                  className="text-center align-middle"
                >
                  <p>#Value!</p>
                  <p>ARTERIAL BLOOG GAS DIAGNOSTIC PROCEDURES</p>
                </th>
              </tr>
              <tr>
                <th>SHIFT</th>
                <th></th>
              </tr>
              <tr>
                <th>TOTAL</th>
                <th>{totalResultCollected?.length}</th>
              </tr>
              <tr>
                <th>EXT</th>
                <th></th>
              </tr>
              <tr>
                <th>DET</th>
                <th>#</th>
              </tr>
              <tr>
                <th>RTOD</th>
                <th></th>
              </tr>
              <tr>
                <th rowSpan={2}>Sample Number</th>
                <th rowSpan={2}>Date</th>
                <th rowSpan={2}>Machine</th>
                <th rowSpan={2}>Time Receiver</th>
                <th rowSpan={2}>Extracted</th>
                <th rowSpan={2}>Determined</th>
                <th rowSpan={2}>Patient Name</th>
                <th rowSpan={2}>Age</th>
                <th rowSpan={2}>Gender</th>
                <th rowSpan={2}>FIO2 Route</th>
                <th>PH</th>
                <th>PCO2</th>
                <th>PO2</th>
                <th>HC03</th>
                <th>BE</th>
                <th>TCO2</th>
                <th>SA02</th>
                <th rowSpan={2}>RTOD</th>
                <th rowSpan={2}>Time Release</th>
                <th>Rendered Time</th>
              </tr>
              <tr>
                <th style={{ width: "70px", maxWidth: "70px" }}>
                  <small className="fw-light">7.35-7.45 mmHg</small>
                </th>
                <th style={{ width: "70px", maxWidth: "70px" }}>
                  <small className="fw-light">35-45 mmHg</small>
                </th>
                <th style={{ width: "70px", maxWidth: "70px" }}>
                  <small className="fw-light">80-100 mmHg</small>
                </th>
                <th style={{ width: "70px", maxWidth: "70px" }}>
                  <small className="fw-light">22-26 mEq/L</small>
                </th>
                <th style={{ width: "70px", maxWidth: "70px" }}>
                  <small className="fw-light">-2-+2 mEq/L</small>
                </th>
                <th>
                  <small className="fw-light">23-29 mmol/L</small>
                </th>
                <th style={{ width: "70px", maxWidth: "70px" }}>
                  <small className="fw-light">95% - 100%</small>
                </th>
                <th>HH:MM</th>
              </tr>
            </thead>
            <tbody>
              {!resultIsLoading && Array.isArray(resultsQuery) ? (
                resultsQuery.map((item, index) => renderRow(item, index))
              ) : (
                <tr>
                  <td colSpan={20} className="text-center">
                    Loading or no data available...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default OverviewPage;
