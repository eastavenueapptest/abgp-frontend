import { Chip } from "@mui/material";
const statusMap = {
  1: {
    text: "On Process",
    sx: { color: "orange", backgroundColor: "rgb(252, 217, 148)" },
  },
  2: {
    text: "For Review",
    sx: { color: "rgb(120, 60, 169)", backgroundColor: "rgb(205, 193, 255)" },
  },
  3: {
    text: "Completed",
    sx: { color: "green", backgroundColor: "rgb(148, 252, 163)" },
  },
};

export const formatStatus = (value) => {
  const status = statusMap[value] || {
    text: "Pending",
    sx: { color: "gray", backgroundColor: "rgb(236, 232, 232)" },
  };
  return (
    <Chip
      label={status.text}
      color="default"
      size="small"
      variant="contained"
      sx={{ p: 1, ...status.sx }}
    />
  );
};
