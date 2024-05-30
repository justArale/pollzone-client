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
    <div className="signup-form-container">
      <form onSubmit={handleSignupSubmit} className="signup-form">
        <h3>Sign Up</h3>

        <div className="input-group">
          <label htmlFor="role">Role</label>
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
              <label htmlFor="creators">Creator</label>
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
              <label htmlFor="fans">Fan</label>
            </div>
          </div>
        </div>

        <div
          ref={categoryContainerRef}
          className={`category-container ${role === "creators" ? "open" : ""}`}
        >
          <div className="input-group">
            <label htmlFor="category">What's your niche?</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={handleCategory}
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
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={handleName}
            autoComplete="off"
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleEmail}
            autoComplete="off"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handlePassword}
            autoComplete="off"
          />
        </div>

        <button type="submit" className="button buttonLarge">
          Create Account
        </button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>
        Already have an account?{" "}
        <a href="#" onClick={onSwitch}>
          Log In
        </a>
      </p>
    </div>
  );
};

export default SignUpForm;
