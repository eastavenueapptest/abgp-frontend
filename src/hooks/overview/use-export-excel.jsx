// ExportToExcel.jsx
import { Button } from "@mui/material";
import * as XLSX from "xlsx-js-style";

const ExportToExcel = ({
  data,
  fileName = "Report.xlsx",
  dateFromTo,
  total,
  ext,
  det,
  rtod,
}) => {
  const handleExport = () => {
    console.log("EXPORT");
    console.log(data);
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Extra info rows (before headers)
    const leftTopRows = [
      ["DATE:", `from ${dateFromTo?.from} to ${dateFromTo?.to}` || "N/A"], // replace with props/values
      ["SHIFT:", "N/A"],
      ["TOTAL:", total || "N/A"],
      ["EXT:", ext || "N/A"],
      ["DET:", det || "N/A"],
      ["RTOD:", rtod || "N/A"],
    ];

    // Define headers
    const mainHeader = [
      "SAMPLE NUMBER",
      "DATE",
      "MACHINE",
      "TIME RECEIVED",
      "EXTRACTED",
      "DETERMINED",
      "ROOM",
      "NAME OF PATIENTS",
      "AGE",
      "GENDER",
      "FIO2 ROUTE",
      "PH",
      "PCO2",
      "PO2",
      "HCO3",
      "BE",
      "TCO2",
      "SAO2",
      "RTOD",
      "TIME RELEASED",
      "RENDERED TIME",
    ];

    const subHeaders = [
      "",
      "", // 👈 Subheader for DATE
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "7.35-7.45 mmHg",
      "35-45 mmHg",
      "80-100 mmHg",
      "22-26 mEq/L",
      "-2 - +2 mEq/L",
      "23-29 mmol/L",
      "95%-100%",
      "",
      "",
      "",
      "HH:MM",
    ];

    // Rows from data
    const rows = data.map((item) => [
      item.request_id || "",
      item.medical_requests_date_created_formatted || "",
      item.machine_name || "",
      item.medical_requests_time_only || "",
      //   EXTRACTED LOGIC
      item.is_determined === 1
        ? "✔️"
        : item.extracted_text === 1 && item.is_determined === 2
          ? "❌"
          : "",
      //   DETERMINED LOGIC
      item.is_determined === 2
        ? "❌"
        : item.extracted_text === 1 && item.is_determined === 1
          ? "✔️"
          : "",
      "",
      item.patient_name || "",
      item.age || "",
      item.sex || "",
      item.fio2_route || "",
      item.extracted_text?.pH || "",
      item.extracted_text?.pCO2 || "",
      item.extracted_text?.PO2 || "",
      item.extracted_text?.HCO3 || "",
      item.extracted_text?.BE || "",
      item.extracted_text?.TCO2 || "",
      item.extracted_text?.SO2 || "",
      item.requestor || "",
      item.results_date_created_formatted || "",
      item.turnaround_time_hh_mm || "",
    ]);

    // Combine everything
    const worksheetData = [...leftTopRows, mainHeader, subHeaders, ...rows];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Merge headers (only for header rows)
    // Merge headers (only for header rows)
    const headerStartRow = leftTopRows.length;
    const headerEndRow = headerStartRow + 1;

    // Define which columns to merge (based on your original intent)
    const columnsToMerge = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9, // first 10 columns
      17,
      18,
      19, // last 3 columns
    ];

    // Build dynamic merge array for headers
    const headerMerges = columnsToMerge.map((colIndex) => ({
      s: { r: headerStartRow, c: colIndex },
      e: { r: headerEndRow, c: colIndex },
    }));

    // Merge B1:C6 for info rows
    const infoRowMerges = Array.from(
      { length: leftTopRows.length },
      (_, i) => ({
        s: { r: i, c: 1 }, // column B
        e: { r: i, c: 2 }, // column C
      })
    );

    // Combine all merges
    ws["!merges"] = [...headerMerges, ...infoRowMerges];

    // Style every cell
    const range = XLSX.utils.decode_range(ws["!ref"]);
    infoRowMerges.forEach(({ s, e }) => {
      const startCell = XLSX.utils.encode_cell(s);
      const endCell = XLSX.utils.encode_cell(e);
      if (!ws[startCell]) ws[startCell] = { t: "s", v: "" };
      if (!ws[endCell]) ws[endCell] = { t: "s", v: "" };
    });
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;

        const isInfoRow = R < leftTopRows.length;
        const isMainHeader = R === headerStartRow;
        const isSubHeader = R === headerEndRow;

        // Apply bold only to column A in info rows
        const fontStyle = isMainHeader
          ? { bold: true, sz: 12 }
          : isInfoRow
            ? { bold: C === 0 }
            : isSubHeader
              ? { sz: 9 }
              : { sz: 11 };

        // Apply fill only to header rows
        const fillStyle =
          isMainHeader || isSubHeader
            ? { fgColor: { rgb: "D9E1F2" } }
            : undefined;

        // Apply border to all info row cells, including merged columns B and C
        const applyBorder =
          isMainHeader || isSubHeader || isInfoRow || R >= headerEndRow;

        ws[cellRef].s = {
          font: fontStyle,
          fill: fillStyle,
          alignment: {
            horizontal: isInfoRow && C === 0 ? "left" : "center",
            vertical: "center",
            wrapText: true,
          },

          border: applyBorder
            ? {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
              }
            : {},
        };
      }
    }

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Export file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <Button
      variant="contained"
      sx={{ textTransform: "capitalize" }}
      onClick={handleExport}>
      Export
    </Button>
  );
};

export default ExportToExcel;
