import { Button } from "@mui/material";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import bg from "../../assets/images/background/bg.png";
import useLoginUser from "../../hooks/auth/use-login-user";
import SimpleForm from "../../shared-components/fields/SimpleForm";
import "../../styles/login-styles.css";

const LoginPage = () => {
  const [input, setInput] = useState(null);
  const { isLoading: isLoginLoading, error } = useLoginUser(input);

  const handleForgotPassword = async () => {
    const formData = new FormData();

    const generateKeyResult = await fetch(
      `https://abg-backend.onrender.com/api/users/generate-secret-key/${input.username}`
    )
      .then((res) => res.json())
      .catch(console.error);

    console.log(generateKeyResult);

    if (generateKeyResult?.key && generateKeyResult?.username) {
      formData.append("username", generateKeyResult.username);
      formData.append("key", generateKeyResult.key);

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
    }
  };

  const handleSubmit = (value) => {
    const newValue = value?.map((item) => {
      return { [item.label]: item.value };
    });
    const finalData = {
      ...newValue.reduce((acc, item) => ({ ...acc, ...item })),
    };
    setInput(finalData);
  };

  const items = [
    { textLabel: "Username", type: "text", name: "username" },
    { textLabel: "Password", type: "password", name: "password" },
  ];

  return (
    <>
      <ToastContainer />
      <div
        id="main-container"
        className="d-flex justify-content-center align-items-center "
      >
        <div id="card-container" className="col-12 rounded-5 shadow h-100 ">
          <img src={bg} alt="Background" className="card-bg-img" />
          <div className="card-bg-overlay"></div>
          <div className="d-flex px-5 h-100 justify-content-center align-items-center position-relative">
            <div className="col-5 d-none d-md-flex d-flex  align-items-center">
              <div className="title-color">
                <h1 style={{ fontSize: "4em" }}>Welcome back!</h1>
                <h2 className="fw-normal">
                  You can sign in to access with your existing account
                </h2>
              </div>
            </div>
            <div className="col-4 d-flex justify-content-center justify-content-lg-end align-items-center">
              <div className="row">
                <div className="col-12 p-5  border rounded-4 shadow-sm bg-white">
                  <SimpleForm
                    title={"Sign in"}
                    items={items}
                    isLoading={isLoginLoading}
                    onSubmit={(formData) => handleSubmit(formData)}
                  />
                  <small>{error}</small>
                </div>
                {error && (
                  <div className="col-6 mt-3">
                    <Button
                      sx={{ color: "white" }}
                      disabled={!input?.username}
                      onClick={handleForgotPassword}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
