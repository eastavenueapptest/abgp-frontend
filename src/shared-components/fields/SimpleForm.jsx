import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import SimpleAutoCompleteInput from "./SimpleAutoCompleteInput";

const SimpleForm = ({ onSubmit, items, title, isLoading, returnTo }) => {
  const [formData, setFormData] = useState(items.map(() => ""));

  const handleChange = (index, value) => {
    const updatedForm = [...formData];
    updatedForm[index] = value;
    setFormData(updatedForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = items.map((item, index) => ({
      label: item.name,
      value: formData[index],
    }));
    onSubmit(data);
  };

  return (
    <form className="row" onSubmit={handleSubmit}>
      <div className="col-12 mb-3 p-0">
        <Typography variant="h4">{title}</Typography>
      </div>
      {items.map((item, index) => (
        <div className="col-12 mb-3 p-0" key={index}>
          {item.type === "dropdown" ? (
            <SimpleAutoCompleteInput
              data={item.options}
              label={item.textLabel}
              value={formData[index]}
              onChange={(event, newValue) => handleChange(index, newValue)}
              getOptionLabel={(option) => option?.label || ""}
            />
          ) : (
            <TextField
              size="small"
              fullWidth
              label={item.textLabel}
              type={item.type}
              slotProps={{
                htmlInput: { maxLength: 30 },
              }}
              sx={{ mr: 1 }}
              value={formData[index]}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          )}
        </div>
      ))}
      <div className="col-12 p-0">
        {returnTo && (
          <Button
            component={Link}
            to={`../${returnTo}`}
            variant="outlined"
            sx={{ textTransform: "capitalize", mr: 2 }}
          >
            Back
          </Button>
        )}
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? "Processing" : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default SimpleForm;
