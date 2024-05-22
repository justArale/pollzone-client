import React from "react";
import { Link } from "react-router-dom";

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
}) => {
  return (
    <div
      style={{
        padding: "20px",
        margin: "20px auto",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        maxWidth: "600px",
      }}
    >

      <form
        onSubmit={handleSignupSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "16px",
          marginTop: "10px",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#333",
            marginBottom: "24px",
          }}
        >
          Sign Up
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "24px",
          }}
        >
          <label
            htmlFor="role"
            style={{
              color: "#666",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            Role
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="radio"
              name="role"
              value="creators"
              id="creators"
              checked={role === "creators"}
              onChange={handleRole}
              style={{
                marginRight: "8px",
              }}
            />
            <label
              htmlFor="creator"
              style={{
                marginRight: "16px",
              }}
            >
              Creator
            </label>
            <input
              type="radio"
              name="role"
              value="fans"
              id="fans"
              checked={role === "fans"}
              onChange={handleRole}
              style={{
                marginRight: "8px",
              }}
            />
            <label htmlFor="fan">Fan</label>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label
            htmlFor="name"
            style={{
              color: "#666",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={handleName}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
              marginBottom: "16px",
            }}
            autoComplete="off"
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label
            htmlFor="email"
            style={{
              color: "#666",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleEmail}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
              marginBottom: "16px",
            }}
            autoComplete="off"
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label
            htmlFor="password"
            style={{
              color: "#666",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handlePassword}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
              marginBottom: "16px",
            }}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            fontWeight: "600",
            padding: "12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Create Account
        </button>
      </form>

      {errorMessage && (
        <p style={{ color: "red", marginTop: "16px" }}>{errorMessage}</p>
      )}

      <p style={{ marginTop: "40px" }}>Already have an account?</p>
      <Link to="/login">Log in</Link>
    </div>
  );
};

export default SignUpForm;
