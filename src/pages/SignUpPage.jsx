import React, { useState } from "react";
import SignUpForm from "../components/SignUpForm";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5005";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handleRole = (e) => setRole(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { email, password, name, role };

    axios
      .post(`${API_URL}/auth/signup`, requestBody)
      .then(() => {
        navigate("/profile");
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <SignUpForm
      handleSignupSubmit={handleSignupSubmit}
      handleEmail={handleEmail}
      handlePassword={handlePassword}
      handleName={handleName}
      handleRole={handleRole}
      email={email}
      password={password}
      name={name}
      role={role}
      errorMessage={errorMessage}
    />
  );
}

export default SignUpPage;
