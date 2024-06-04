import React from "react";
import "./LogInForm.css";

const LogInForm = ({
  handleLoginSubmit,
  handleEmail,
  handlePassword,
  email,
  password,
  errorMessage,
  onSwitch,
}) => {
  return (
    <div className="sign-up">
      <form onSubmit={handleLoginSubmit} className="signup-form">
        <h3 className="sectionTitle">Log In</h3>

        <div className="input-group">
          <label htmlFor="email" className="label secondaryColor">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleEmail}
            autoComplete="off"
            placeholder="What's your email?"
            className="signUpInput"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="label secondaryColor">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handlePassword}
            autoComplete="off"
            placeholder="••••••••••••••••"
            className="signUpInput"
          />
        </div>

        <button
          type="submit"
          className="button buttonPrimaryLarge buttonFont buttonFontReverse"
        >
          Log In
        </button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p className="bodyLink">
        Don't have an account?{" "}
        <a href="#" onClick={onSwitch}>
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default LogInForm;
