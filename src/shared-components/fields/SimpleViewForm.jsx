import DeleteIcon from "@mui/icons-material/Delete";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SimpleAutoCompleteInput from "./SimpleAutoCompleteInput";

const SimpleForm = ({
  title,
  items = [],
  isLoading = false,
  onSubmit,
  onDelete,
  returnTo,
  fields = [],
}) => {
  const [formData, setFormData] = useState(
    Array.isArray(items) && items.length > 0 ? items[0] : {}
  );
  useEffect(() => {
    if (Array.isArray(items) && items.length > 0) {
      setFormData(items[0]);
    }
  }, [items]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="row" onSubmit={handleSubmit}>
      <div className="d-flex justify-content-between align-items-center col-12 mb-3 p-0">
        <Typography variant="h4">{title}</Typography>
        {onDelete && (
          <Button
            type="button"
            variant="contained"
            color="error"
            onClick={() => onDelete(formData)}
            disabled={isLoading}
          >
            <DeleteIcon />
            Delete
          </Button>
        )}
      </div>

      {fields.map((field) => (
        <div key={field.name} className="col-12 mb-3 p-0">
          {field.type === "text" || field.type === "number" ? (
            <TextField
              size="small"
              fullWidth
              label={field.label}
              type={field.type}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          ) : field.type === "autocomplete" ? (
            <SimpleAutoCompleteInput
              data={field.options}
              label={field.label}
              value={
                field.options.find(
                  (option) => option.value === formData[field.name]
                ) || null
              }
              onChange={(event, newValue) =>
                handleChange(field.name, newValue?.value || "")
              }
              getOptionLabel={(option) => option?.label || ""}
              loading={field.loading}
            />
          ) : null}
        </div>
      ))}

      <div className="col-12 p-0">
        <Button
          component={Link}
          to={`../${returnTo}`}
          variant="contained"
          sx={{ textTransform: "capitalize", mr: 2 }}
        >
          Back
        </Button>
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? (
            <>
              <CircularProgress size={18} sx={{ mr: 1 }} /> Processing...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
};

export default SimpleForm;
