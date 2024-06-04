import React, { useEffect, useRef } from "react";
import "./SignUpForm.css";

const SignUpForm = ({
  handleSignupSubmit,
  handleEmail,
  handlePassword,
  handleName,
  handleRole,
  handleCategory,
  email,
  password,
  name,
  role,
  category,
  errorMessage,
  onSwitch,
}) => {
  const categoryContainerRef = useRef(null);

  useEffect(() => {
    if (role === "creators") {
      categoryContainerRef.current.style.maxHeight = `${categoryContainerRef.current.scrollHeight}px`;
    } else {
      categoryContainerRef.current.style.maxHeight = "0";
    }
  }, [role]);

  return (
    <div className="sign-up">
      <form onSubmit={handleSignupSubmit} className="signup-form">
        <h3 className="sectionTitle">Sign Up</h3>
        <div className="input-group">
          <label htmlFor="name" className="label secondaryColor">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={handleName}
            autoComplete="off"
            className="signUpInput"
            placeholder="What's your name?"
          />
        </div>

        <div className="input-group">
          <label htmlFor="role" className="label secondaryColor">
            Role
          </label>

          <div className="role-options">
            <div>
              <input
                type="radio"
                name="role"
                value="creators"
                id="creators"
                checked={role === "creators"}
                onChange={handleRole}
              />
              <label htmlFor="creators" className="body">
                Creator
              </label>
            </div>
            <div>
              <input
                type="radio"
                name="role"
                value="fans"
                id="fans"
                checked={role === "fans"}
                onChange={handleRole}
              />
              <label htmlFor="fans" className="body">
                Fan
              </label>
            </div>
          </div>
        </div>

        <div
          ref={categoryContainerRef}
          className={`category-container ${role === "creators" ? "open" : ""}`}
        >
          <div className="input-group">
            <label htmlFor="category" className="label secondaryColor">
              What's your niche?
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={handleCategory}
              className="signUpInput"
            >
              <option value="" disabled>
                Choose category
              </option>
              {[
                "Music",
                "Sports",
                "Art",
                "Gaming",
                "Beauty",
                "Culinary",
                "Travel",
                "Fitness",
                "Film & Video",
                "Audio & Podcasts",
              ].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

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
            className="signUpInput"
            placeholder="What's your email?"
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
          Create Account
        </button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p className="bodyLink">
        Already have an account?{" "}
        <a href="#" onClick={onSwitch}>
          Log In
        </a>
      </p>
    </div>
  );
};

export default SignUpForm;
