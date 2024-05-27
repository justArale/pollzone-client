import React from "react";
import { Link } from "react-router-dom";
import "./SignUpForm.css";
import { useEffect } from "react";

const SignUpForm = ({
  handleSignupSubmit,
  handleEmail,
  handlePassword,
  handleName,
  handleRole,
  email,
  password,
  name,
  role,
  errorMessage,
  // isOpen,
  // onClose,
}) => {
  // useEffect(() => {
  //   // Event-Listener to close the overlay if you click outside
  //   const handleClickOutside = (event) => {
  //     if (isOpen && !event.target.closest(".overlay-container")) {
  //       onClose();
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isOpen, onClose]);

  return (
    <>
      {/* {isOpen ? ( */}
      <div className="overlay">
        {/* <div className="overlay_background" onClick={onClose} /> */}
        <div className="overlay-container">
          <div className="overlay__controls">
            <form onSubmit={handleSignupSubmit} className="formOne">
              <h3 className="signupHeader">Sign Up</h3>

              <div className="formTwo">
                <label htmlFor="role" className="label">
                  Role
                </label>
                <div className="formThree">
                  <input
                    type="radio"
                    name="role"
                    value="creators"
                    id="creators"
                    checked={role === "creators"}
                    onChange={handleRole}
                    className="roleInput"
                  />
                  <label htmlFor="creator" className="creatorLabel">
                    Creator
                  </label>
                  <input
                    type="radio"
                    name="role"
                    value="fans"
                    id="fans"
                    checked={role === "fans"}
                    onChange={handleRole}
                    className="roleInput"
                  />
                  <label htmlFor="fan">Fan</label>
                </div>
              </div>

              <div className="formFour">
                <label htmlFor="name" className="label">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={handleName}
                  className="typeInput"
                  autoComplete="off"
                />
              </div>

              <div className="formFour">
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={handleEmail}
                  className="typeInput"
                  autoComplete="off"
                />
              </div>

              <div className="formFour">
                <label htmlFor="password" className="label">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={handlePassword}
                  className="typeInput"
                  autoComplete="off"
                />
              </div>

              <button type="submit" className="createAccountButton">
                Create Account
              </button>
            </form>

            {errorMessage && <p className="errorMessage">{errorMessage}</p>}

            <p className="logIn">Already have an account?</p>
            <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
      {/* ) : null} */}
    </>
  );
};

export default SignUpForm;
