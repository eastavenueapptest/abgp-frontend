import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import SimpleAutoCompleteInput from "./SimpleAutoCompleteInput";

const SimpleForm = ({
  onSubmit,
  items,
  title,
  isLoading,
  returnTo,
  isLogin,
}) => {
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
  console.log(formData[0]);
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
          {item.errorMessage && (
            <small className="text-danger">{item.errorMessage}</small>
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
        <>
          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: "capitalize",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Processing" : "Submit"}
          </Button>

          {isLogin && <LoginForm username={formData[0]} />}
        </>
      </div>
    </form>
  );
};

export default SimpleForm;

const LoginForm = ({ username }) => {
  const handleForgotPassword = async () => {
    const formData = new FormData();

    const generateKeyResult = await fetch(
      `https://abg-backend.onrender.com/api/users/generate-secret-key/${username}`
    )
      .then((res) => res.json())
      .catch(console.error);

    if (generateKeyResult?.success == true) {
      formData.append("username", username);
      fetch(
        "https://script.google.com/macros/s/AKfycbz49BTqBw4hmCZUnLF4leWj2nUGel4_R7VzXMQ-zusc7Gi02Z1bEgeJKEe8VDxocbtf/exec",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((res) => res.json())
        .then(console.log)
        .catch(console.error);
    } else {
      throw new Error("No user found");
    }
  };
  return (
    <Button
      sx={{
        color: "green",
        ml: 1,
        textTransform: "capitalize",
      }}
      variant="outlined"
      onClick={handleForgotPassword}
    >
      Forgot Password?
    </Button>
  );
};
