import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
const SimpleAutoCompleteInput = ({
  data = [],
  label = "Select",
  value,
  onChange,
  sx = {},
  getOptionLabel = (option) => option?.label || "",
  ...props
}) => {
  return (
    <Autocomplete
      disablePortal
      options={data}
      value={value}
      onChange={onChange}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, val) => option?.id === val?.id}
      sx={{ width: "100%", ...sx }}
      size="small"
      renderInput={(params) => <TextField {...params} label={label} />}
      {...props}
    />
  );
};

export default SimpleAutoCompleteInput;
