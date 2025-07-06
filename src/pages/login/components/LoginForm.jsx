import React, { useState } from "react";

const LoginForm = ({ onSubmit, defaultValues, disabled, errors }) => {
  const [email, setEmail] = useState(defaultValues?.email || "");
  const [password, setPassword] = useState(defaultValues?.password || "");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="form-floating mb-3">
        <input
          type="email"
          className="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="floatingInput">Email address</label>
        {errors.email && <small className="text-danger">{errors.email}</small>}
      </div>

      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="floatingPassword">Password</label>
        {errors.password && (
          <small className="text-danger">{errors.password}</small>
        )}
      </div>

      <div className="d-grid">
        <button className="btn btn-primary" type="submit" disabled={disabled}>
          {disabled ? "Logging in..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
