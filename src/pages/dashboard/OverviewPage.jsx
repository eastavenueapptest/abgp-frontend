import { useCallback } from "react";
import useGetMachineDevice from "../../hooks/medical-record/use-get-machine-devices";
import useGetMedicalResults from "../../hooks/medical-record/use-get-medical-results";
import SimpleCardCounter from "../../shared-components/cards/SimpleCardCounter";

const OverviewPage = () => {
  const { data: resultsQuery, isLoading: resultIsLoading } =
    useGetMedicalResults();
  const { data: machineQuery } = useGetMachineDevice();

  const renderRow = useCallback(
    (item, index) => {
      const abgResult = JSON.parse(item?.extracted_text);
      const machineName = machineQuery.find(
        (machine) => machine.id === item.machine_id
      );
      return (
        <tr key={index}>
          <td className="align-middle">{item?.id}</td>
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
          <td className="align-middle">{abgResult?.tco2 ?? "-"}</td>
          <td className="align-middle">{abgResult?.sao2 ?? "-"}</td>
          <td className="align-middle">{item?.timeRelease}</td>
          <td className="align-middle">{item?.renderedTime}</td>
          <td className="align-middle">{item?.renderedTime}</td>
        </tr>
      );
    },
    [machineQuery]
  );

  return (
    <div className="row overflow-auto">
      <div className="col-12">
        <SimpleCardCounter />
      </div>
      <div className="col-12">
        <table className="table table-bordered census-table text-center">
          <thead>
            <tr>
              <th>DATE</th>
              <th></th>
              <th rowSpan={6} colSpan={18} className="text-center align-middle">
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
              <th>{resultsQuery?.length}</th>
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
  );
};
export default OverviewPage;
