import { Check, Close, FolderOpen, Search } from "@mui/icons-material";
import { TextField } from "@mui/material";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useGetMedicalResults from "../../hooks/medical-record/use-get-medical-results";
import SimpleCardCounter from "../../shared-components/cards/SimpleCardCounter";
import SimpleAutoCompleteInput from "../../shared-components/fields/SimpleAutoCompleteInput";

import dohLogo from "../../assets/images/brand/dohLogo.png";
import eastAveLogo from "../../assets/images/brand/eastAveLogo.png";
import ExportToExcel from "../../hooks/overview/use-export-excel";
const OverviewPage = () => {
  const now = moment().utcOffset(8).format("YYYY-MM-DDTHH:mm");

  const [selectedRt, setSelectedRt] = useState(null);
  const [date, setDate] = useState({
    from: now,
    to: now,
  });

  const [shift, setShift] = useState(() => ({
    from: moment(date.from, "YYYY-MM-DDTHH:mm").format("hh:mm A"),
    to: moment(date.to, "YYYY-MM-DDTHH:mm").format("hh:mm A"),
  }));

  const adjustedToDate = moment(date.to)
    .add(1, "seconds")
    .format("YYYY-MM-DDTHH:mm");
  const { data: resultsQuery, isLoading: resultIsLoading } =
    useGetMedicalResults({
      from: date.from,
      to: adjustedToDate,
    });

  const filteredResults = useMemo(() => {
    if (!selectedRt?.respiratory_therapists) return resultsQuery;
    return resultsQuery?.filter(
      (e) => e.respiratory_therapists === selectedRt.respiratory_therapists
    );
  }, [resultsQuery, selectedRt]);

  const totalResultCollected = filteredResults?.filter((item) =>
    [2, 3].includes(item.status)
  );

  const totalForReview = filteredResults?.filter((item) => item.status === 2);
  const totalCompleted = filteredResults?.filter((item) => item.status === 3);
  const totalDetermined = filteredResults?.filter(
    (item) => item.is_determined === 1
  );
  const totalExtracted = filteredResults?.filter(
    (item) => item.is_determined === 2
  );

  const rtOnDuty = useMemo(() => {
    if (!resultsQuery) return [];

    const seen = new Set();
    return resultsQuery
      .filter((item) => item.status > 0)
      .map(({ respiratory_therapists }) => respiratory_therapists)
      .filter((rt) => {
        if (seen.has(rt)) return false;
        seen.add(rt);
        return true;
      })
      .map((rt) => ({ respiratory_therapists: rt }));
  }, [resultsQuery]);

  const renderRow = useCallback((item, index) => {
    return (
      <tr key={index}>
        <td className="align-middle">
          <Link
            to={`./medical-records/request/view/${item?.request_id}`}
            style={{
              textDecoration: "none",
              cursor: "pointer",
              padding: 3,
              color: "black",
            }}
          >
            {item?.request_id}
          </Link>
        </td>
        <td className="align-middle">
          {item?.medical_requests_date_created_formatted}
        </td>
        <td className="align-middle">{item.machine_name}</td>
        <td className="align-middle">{item?.medical_requests_time_only}</td>
        <td className="align-middle">
          {item?.is_determined === 1 && <Check />}
        </td>
        <td className="align-middle">
          {item?.is_determined === 2 && <Close />}
        </td>
        <td className="align-middle">{item?.patient_name}</td>
        <td className="align-middle">{item?.age}</td>
        <td className="align-middle">{item?.sex}</td>
        <td className="align-middle">{item?.fio2_route}</td>
        <td className="align-middle">{item?.extracted_text?.pH}</td>
        <td className="align-middle">{item?.extracted_text?.pCO2}</td>
        <td className="align-middle">{item?.extracted_text?.PO2}</td>
        <td className="align-middle">{item?.extracted_text?.HCO3}</td>
        <td className="align-middle">{item?.extracted_text?.BE}</td>
        <td className="align-middle">{item?.extracted_text?.SO2 ?? "-"}</td>
        <td className="align-middle">{item?.extracted_text?.TCO2 ?? "-"}</td>
        <td className="align-middle">{item?.respiratory_therapists}</td>
        <td className="align-middle">{item?.results_date_created_formatted}</td>
        <td className="align-middle">{item?.turnaround_time_hh_mm}</td>
      </tr>
    );
  }, []);

  const imageStyle = {
    borderRadius: "50%",
    height: "50px",
    width: "50px",
    backgroundColor: "grey",
  };

  useEffect(() => {
    setShift({
      from: moment(date.from, "YYYY-MM-DDTHH:mm").format("hh:mm A"),
      to: moment(date.to, "YYYY-MM-DDTHH:mm").format("hh:mm A"),
    });
  }, [date.from, date.to]);
  return (
    <div className="container-fluid">
      <div className="row align-items-center">
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
          <div className="row p-4">
            <div className="col-12 d-flex align-items-center gap-2 mb-3">
              <TextField
                label="Date From"
                type="datetime-local"
                size="small"
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
              />
              <TextField
                label="Date To"
                type="datetime-local"
                size="small"
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
            <div className="col-12 d-flex align-items-center gap-2 ">
              <SimpleAutoCompleteInput
                data={rtOnDuty}
                label="Respiratory Therapists on duty"
                value={selectedRt}
                onChange={(event, newValue) => setSelectedRt(newValue)}
                getOptionLabel={(option) => option?.respiratory_therapists}
              />

              <ExportToExcel
                data={filteredResults}
                shift={`${shift?.from} to ${shift?.to}`}
                dateFromTo={`from ${date?.from} to ${date?.to}`}
                total={totalResultCollected?.length}
                ext={totalExtracted?.length}
                det={totalDetermined?.length}
                rtod={selectedRt?.respiratory_therapists ?? "ALL"}
              />
            </div>
          </div>
        </div>
        <div className="col-12 overflow-auto bg-white  table-responsive p-0">
          <table
            className="table table-bordered census-table text-center p-0"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                <th style={{ width: "100px" }}>DATE</th>
                <th style={{ width: "160px" }}>
                  <small className="fw-normal">
                    from <br /> {moment(date.from).format("YYYY/MM/DD")} <br />{" "}
                    to <br /> {moment(date.to).format("YYYY/MM/DD")}
                  </small>
                </th>
                <th
                  rowSpan={6}
                  colSpan={18}
                  className="text-center align-middle"
                  style={{ width: "2200px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <img src={dohLogo} style={imageStyle} alt="doh-logo" />
                    </div>
                    <div>
                      <strong>Republic of the Philippines</strong>
                      <br />
                      <strong>DEPARTMENT OF HEALTH</strong>
                      <br />
                      <strong>East Avenue Medical Center</strong>
                      <br />
                      <br />
                      <strong>PULMONARY SECTION</strong>
                      <br />
                      <strong style={{ textDecoration: "underline" }}>
                        ARTERIAL BLOOD GAS OFFICIAL RESULT
                      </strong>
                    </div>
                    <div>
                      <img
                        src={eastAveLogo}
                        style={imageStyle}
                        alt="east-ave-logo"
                      />
                    </div>
                  </div>
                </th>
              </tr>
              <tr>
                <th>SHIFT</th>
                <th>
                  <small className="fw-normal">
                    {shift?.from} to {shift?.to}
                  </small>
                </th>
              </tr>
              <tr>
                <th>TOTAL</th>
                <th>{totalResultCollected?.length}</th>
              </tr>
              <tr>
                <th>EXT</th>
                <th>{totalExtracted?.length}</th>
              </tr>
              <tr>
                <th>DET</th>
                <th>{totalDetermined?.length}</th>
              </tr>
              <tr>
                <th>RTOD</th>
                <th>{selectedRt?.respiratory_therapists ?? "ALL"}</th>
              </tr>
              <tr>
                <th rowSpan={2} className="text-uppercase align-middle">
                  Sample Number
                </th>
                <th rowSpan={2} className="text-uppercase align-middle">
                  Date
                </th>
                <th rowSpan={2} className="text-uppercase align-middle">
                  Machine
                </th>
                <th rowSpan={2} className="text-uppercase align-middle">
                  Time Receiver
                </th>
                <th rowSpan={2} className="text-uppercase align-middle">
                  Extracted
                </th>
                <th rowSpan={2} className="text-uppercase align-middle">
                  Determined
                </th>
                <th rowSpan={2} className="text-uppercase align-middle">
                  Name of patients
                </th>
                <th rowSpan={2} className="text-uppercase align-middle">
                  Age
                </th>
                <th rowSpan={2} className="text-uppercase align-middle">
                  Gender
                </th>
                <th rowSpan={2} className="text-uppercase align-middle">
                  FIO2 <br />
                  Route
                </th>
                <th className="text-uppercase align-middle">PH</th>
                <th className="text-uppercase align-middle">PCO2</th>
                <th className="text-uppercase align-middle">PO2</th>
                <th className="text-uppercase align-middle">HC03</th>
                <th className="text-uppercase align-middle">BE</th>
                <th className="text-uppercase align-middle">TCO2</th>
                <th className="text-uppercase align-middle">SA02</th>
                <th rowSpan={2} className="text-uppercase align-middle">
                  RTOD
                </th>
                <th rowSpan={2} className="text-uppercase align-middle">
                  Time Release
                </th>
                <th className="text-uppercase align-middle">Rendered Time</th>
              </tr>
              <tr>
                <th className="text-uppercase align-middle">
                  <small className="fw-light">7.35-7.45 mmHg</small>
                </th>
                <th className="text-uppercase align-middle">
                  <small className="fw-light">35-45 mmHg</small>
                </th>
                <th className="text-uppercase align-middle">
                  <small className="fw-light">80-100 mmHg</small>
                </th>
                <th className="text-uppercase align-middle">
                  <small className="fw-light">22-26 mEq/L</small>
                </th>
                <th className="text-uppercase align-middle">
                  <small className="fw-light">-2-+2 mEq/L</small>
                </th>
                <th className="text-uppercase align-middle">
                  <small className="fw-light">23-29 mmol/L</small>
                </th>
                <th className="text-uppercase align-middle">
                  <small className="fw-light">95% - 100%</small>
                </th>
                <th className="text-uppercase align-middle">HH:MM</th>
              </tr>
            </thead>
            <tbody>
              {!resultIsLoading && Array.isArray(filteredResults) ? (
                filteredResults.map((item, index) => renderRow(item, index))
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
