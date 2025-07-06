import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useChangePassword from "../../hooks/users/use-change-password";
import useGetUsers from "../../hooks/users/use-get-users";

const UpdatePasswordPage = () => {
  const { data: users, isLoading } = useGetUsers();
  const [selectedId, setSelectedId] = useState("");
  const [newPassword, setNewpassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const {
    changePassword,
    data,
    isLoading: cpIsLoading,
    error: cpError,
  } = useChangePassword(selectedId, newPassword);
  const handleChange = (e) => {
    setSelectedId(e.target.value);
  };
  const handleNewPassword = (e) => {
    setNewpassword(e.target.value);
  };
  const handleCheckPassword = (e) => {
    setCheckPassword(e.target.value);
  };

  function handlePasswordChecking() {
    const isFilled = newPassword.trim() && checkPassword.trim();
    const isMatch = newPassword.trim() === checkPassword.trim();
    return isFilled && isMatch;
  }
  const handleSubmit = async () => {
    try {
      console.log(selectedId, newPassword);
      await changePassword(selectedId, { password: newPassword });
      if (cpError) {
        console.error(`Error: ${cpError}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {}, [selectedId, newPassword, checkPassword]);
  return (
    <div className="row">
      <h2 className="pb-3">Update password</h2>
      <div className="col-12">
        <div className="row col-6">
          <FormControl fullWidth className=" gap-3">
            <InputLabel id="user-simple-select-label">
              {selectedId ? "Selected user" : "Select user"}
            </InputLabel>

            <Select
              labelId="user-simple-select-label"
              id="user-simple-select"
              value={selectedId}
              label={selectedId ? "Selected user" : "Select user"}
              onChange={handleChange}
            >
              {users
                ?.filter((item) => item.position_id != 5)
                ?.map((user, index) => {
                  return (
                    <MenuItem key={index} value={user?.id}>
                      {user?.employee_name} {`(${user?.position_name})`}
                    </MenuItem>
                  );
                })}
            </Select>

            <TextField
              id="outlined-basic"
              label="New password"
              variant="outlined"
              type="password"
              disabled={!selectedId}
              onChange={handleNewPassword}
            />
            <TextField
              id="outlined-basic"
              label="Re-type your new password"
              variant="outlined"
              type="password"
              disabled={!selectedId}
              onChange={handleCheckPassword}
            />

            <div className="d-flex justify-content-end gap-1">
              <Button
                component={Link}
                to={`../../users`}
                variant="contained"
                sx={{ textTransform: "capitalize" }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                sx={{ textTransform: "capitalize" }}
                disabled={!handlePasswordChecking()}
                onClick={handleSubmit}
              >
                {cpIsLoading ? "Loading ..." : "Submit"}
              </Button>
            </div>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
