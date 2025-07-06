import TablePagination from "@mui/material/TablePagination";
import { styled } from "@mui/material/styles";
import React from "react";

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  "& .MuiTablePagination-selectLabel": {
    margin: "0 !important",
  },
  "& .MuiTablePagination-displayedRows": {
    margin: "0 !important",
  },
}));

const SimplePagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25],
  sx,
  ...props
}) => {
  return (
    <StyledTablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={rowsPerPageOptions}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        ...sx,
      }}
      {...props}
    />
  );
};

export default SimplePagination;
