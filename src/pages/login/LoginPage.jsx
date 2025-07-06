import { useEffect, useState } from "react";
import useLoginUser from "../../hooks/auth/use-login-user";
import SimpleForm from "../../shared-components/fields/SimpleForm";

const LoginPage = () => {
  const [input, setInput] = useState(null);
  const { isLoading: isLoginLoading, error } = useLoginUser(input);

  const handleSubmit = (value) => {
    const newValue = value?.map((item) => {
      return { [item.label]: item.value };
    });
    const finalData = {
      ...newValue.reduce((acc, item) => ({ ...acc, ...item })),
      isMobile: false,
    };
    setInput(finalData);
  };
  const items = [
    { textLabel: "Username", type: "text", name: "username" },
    { textLabel: "Password", type: "password", name: "password" },
  ];

  useEffect(() => {}, [input]);

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-lg-6 p-5 border rounded shadow-sm">
          <SimpleForm
            title={"Sign in Account"}
            items={items}
            isLoading={isLoginLoading}
            onSubmit={(formData) => handleSubmit(formData)}
          />
          <small>{error}</small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
