import { useState } from "react";
import bg from "../../assets/images/background/bg.png";
import useLoginUser from "../../hooks/auth/use-login-user";
import SimpleForm from "../../shared-components/fields/SimpleForm";
import "../../styles/login-styles.css";

const LoginPage = () => {
  const [input, setInput] = useState(null);
  const { isLoading: isLoginLoading, error } = useLoginUser(input);

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
            <div className=" p-5 border rounded-4 shadow-sm bg-white">
              <SimpleForm
                title={"Sign in"}
                items={items}
                isLoading={isLoginLoading}
                onSubmit={(formData) => handleSubmit(formData)}
              />
              <small>{error}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
