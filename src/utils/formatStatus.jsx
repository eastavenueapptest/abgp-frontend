import { Chip } from "@mui/material";
const statusMap = {
  1: {
    text: "On Process",
    sx: { color: "gray", backgroundColor: "rgb(236, 232, 232)" },
  },
  2: {
    text: "For Review",
    sx: { color: "green", backgroundColor: "rgb(148, 252, 163)" },
  },
  3: {
    text: "Completed",
    sx: { color: "blue", backgroundColor: "rgba(148, 186, 252, 1)" },
  },
};

export const formatStatus = (value) => {
  const status = statusMap[value] || {
    text: "Uknown",
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
