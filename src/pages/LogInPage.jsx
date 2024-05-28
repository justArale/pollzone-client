// import { useState, useContext } from "react";
// import LoginForm from "../components/LogInForm";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/auth.context";

// import axios from "axios";

// const API_URL = "http://localhost:5005";

// const LogInPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState(undefined);

//   const navigate = useNavigate();

//   const { storeToken, authenticateUser } = useContext(AuthContext);

//   const handleEmail = (e) => setEmail(e.target.value);
//   const handlePassword = (e) => setPassword(e.target.value);

//   const handleLoginSubmit = (e) => {
//     e.preventDefault();
//     const requestBody = { email, password };

//     axios
//       .post(`${API_URL}/auth/login`, requestBody)
//       .then((response) => {
//         console.log("JWT token", response.data.authToken);

//         storeToken(response.data.authToken);
//         authenticateUser();
//         navigate("/profile");
//       })
//       .catch((error) => {
//         const errorDescription = error.response.data.message;
//         setErrorMessage(errorDescription);
//       });
//   };

//   return (
//     <LoginForm
//       handleLoginSubmit={handleLoginSubmit}
//       handleEmail={handleEmail}
//       handlePassword={handlePassword}
//       email={email}
//       password={password}
//       errorMessage={errorMessage}
//     />
//   );
// };

// export default LogInPage;
