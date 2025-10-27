import { ToastContainer } from "react-toastify";
import bg from "../../assets/images/background/lock.jpg";
import useResetpasswordKey from "../../hooks/auth/use-reset-password-via-secret-key";
import SimpleForm from "../../shared-components/fields/SimpleForm";
import "../../styles/login-styles.css";

const ResetPage = () => {
  const { resetPassword, isLoading, error } = useResetpasswordKey();

  const handleSubmit = (value) => {
    const newValue = value?.map((item) => {
      return { [item.label]: item.value };
    });

    resetPassword(newValue);
  };

  const items = [
    { textLabel: "Secret Key", type: "text", name: "key" },
    { textLabel: "New Password", type: "password", name: "password" },
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
                <h1 style={{ fontSize: "4em" }}>Reset password!</h1>
                <h2 className="fw-normal">
                  Use the secret key and type your new password.
                </h2>
              </div>
            </div>
            <div className="col-4 d-flex justify-content-center justify-content-lg-end align-items-center">
              <div className=" p-5 border rounded-4 shadow-sm bg-white">
                <SimpleForm
                  items={items}
                  isLoading={isLoading}
                  onSubmit={handleSubmit}
                />
                <small>{error}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPage;
