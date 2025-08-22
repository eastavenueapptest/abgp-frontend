import { Chip } from "@mui/material";
const statusMap = {
  1: {
    text: "Inactive",
    sx: { color: "gray", backgroundColor: "rgb(236, 232, 232)" },
  },
};

export const formatActiveStatus = (value) => {
  const status = statusMap[value] || {
    text: "Active",
    sx: { color: "green", backgroundColor: "rgb(148, 252, 163)" },
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
