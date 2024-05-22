import React, { useState, useContext } from "react";
import SignUpForm from "../components/SignUpForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handleRole = (e) => setRole(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password, name, role };

    axios
    .post(`${API_URL}/auth/signup`, requestBody)
    .then(() => {
      // After successful signup, perform login
      const loginRequestBody = { email, password };
      return axios.post(`${API_URL}/auth/login`, loginRequestBody);
    })
    .then((response) => {
      const { authToken } = response.data;
      storeToken(authToken);
      authenticateUser();
      navigate("/profile");
    })
    .catch((error) => {
      const errorDescription = error.response?.data?.message || "An error occurred";
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
