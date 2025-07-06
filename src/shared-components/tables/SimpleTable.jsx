import { Visibility } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditDocument";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SimplePagination from "./SimplePagination";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead({
  columns,
  order,
  orderBy,
  onRequestSort,
  enableRowAction,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.numeric ? "right" : "left"}
            padding="normal"
            sortDirection={orderBy === column.id ? order : false}>
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : "asc"}
              onClick={createSortHandler(column.id)}>
              {column.label}
              {orderBy === column.id && (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
        {enableRowAction && <TableCell>Actions</TableCell>}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({
  title,
  search,
  onSearchChange,
  enableCreateFunction = false,
  enableUpdatePasswordFunction = false, // Update-Password
}) {
  const parentPath = useLocation();

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { sm: 2 },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
      }}>
      <Typography variant="h6" id="tableTitle" component="div">
        {title}
      </Typography>

      <Box display="flex" alignItems="center" gap={1}>
        <TextField
          size="small"
          label="Search"
          sx={{ mr: 1 }}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {enableCreateFunction && (
          <Button
            component={Link}
            to={`${parentPath.pathname}/create`}
            variant="contained"
            sx={{ textTransform: "capitalize" }}>
            <AddIcon /> Create
          </Button>
        )}

        {enableUpdatePasswordFunction && ( // Update-Password
          <Button
            component={Link}
            to={`${parentPath.pathname}/update-password`}
            variant="contained"
            sx={{ textTransform: "capitalize" }}>
            <EditIcon /> Update password
          </Button>
        )}
      </Box>
    </Toolbar>
  );
}

export default function SimpleTable({
  columns,
  rows,
  title,
  enableRowAction = false,
  enableCreateFunction = false,
  enableUpdatePasswordFunction = false, // Update-Password
}) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(columns[0]?.id || "");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(0);
  };

  const handleView = (rowId) => {
    navigate(`${location.pathname}/view/${rowId}`);
  };

  const visibleRows = useMemo(() => {
    const searchLower = search.toLowerCase();
    const filtered = rows.filter((row) =>
      columns.some((col) =>
        String(row[col.id] ?? "")
          .toLowerCase()
          .includes(searchLower)
      )
    );

    return filtered
      .slice()
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [search, order, orderBy, page, rowsPerPage, rows, columns]);

  const filteredCount = useMemo(() => {
    const searchLower = search.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) =>
        String(row[col.id] ?? "")
          .toLowerCase()
          .includes(searchLower)
      )
    ).length;
  }, [search, rows, columns]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCount) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          title={title}
          search={search}
          onSearchChange={handleSearchChange}
          enableCreateFunction={enableCreateFunction}
          enableUpdatePasswordFunction={enableUpdatePasswordFunction} // Update-Password
        />

        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small">
            <EnhancedTableHead
              columns={columns}
              order={order}
              orderBy={orderBy}
              enableRowAction={enableRowAction}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow hover tabIndex={-1} key={row.id}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.numeric ? "right" : "left"}
                      sx={{ textTransform: "capitalize" }}>
                      {row[column.id]}
                    </TableCell>
                  ))}
                  {enableRowAction && (
                    <TableCell>
                      <IconButton
                        color="info"
                        size="small"
                        onClick={() => handleView(row.id)}>
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={columns.length + 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <SimplePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          sx={{ display: "flex", justifyContent: "flex-end", pr: 2 }}
          count={filteredCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

SimpleTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  enableRowAction: PropTypes.bool,
  enableCreateFunction: PropTypes.bool,
  enableUpdatePasswordFunction: PropTypes.bool, // Update-Password
};

SimpleTable.defaultProps = {
  title: "Table",
  enableRowAction: false,
  enableCreateFunction: false,
  enableUpdatePasswordFunction: false, // Update-Password
};
