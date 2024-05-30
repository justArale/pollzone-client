import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import "./Navbar.css";
import logo from "../assets/images/LogoPollZone.png";
import LoginForm from "../components/LogInForm";
import SignUpForm from "../components/SignUpForm";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Navbar({ isOverlayOpen, handleLoginClick, handleCloseOverlay, isLogin, setIsLogin }) {
    const location = useLocation();
    const { isLoggedIn, logOutUser } = useContext(AuthContext);

  return (
    <>
      <nav>
        <div className="headerBar">
          <div>
            {isLoggedIn ? (
              <Link to="/dashboard">
                <img src={logo} alt="PollZone Logo" className="logo" />
              </Link>
            ) : (
              <Link to="/">
                <img src={logo} alt="PollZone Logo" className="logo" />
              </Link>
            )}
          </div>
          <div className="pageWrapper">
            <Link className="link" to="/creators">
              All Creators
            </Link>
            <Link className="link" to="/projects">
              All Projects
            </Link>
            <Link className="link" to="/profile">
              My Profile
            </Link>

            <div>
              {isLoggedIn ? (
                <button
                  onClick={logOutUser}
                  className="button buttonSmall buttonReverse"
                >
                  Log Out
                </button>
              ) : (
                <>
                  {location.pathname !== "/login" &&
                    location.pathname !== "/signup" && (
                      <>
                        <button
                          onClick={handleLoginClick}
                          className="button buttonSmall"
                        >
                          Log In
                        </button>
                      </>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {isOverlayOpen && (
        <Overlay
          isLogin={isLogin}
          onClose={handleCloseOverlay}
          onSwitch={() => setIsLogin(!isLogin)}
        />
      )}
    </>
  );
}

function Overlay({ isLogin, onClose, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("fans");
  const [category, setCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handleRole = (e) => setRole(e.target.value);
  const handleCategory = (e) => setCategory(e.target.value);

  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    axios
      .post(`${API_URL}/auth/login`, requestBody)
      .then((response) => {
        storeToken(response.data.authToken);
        authenticateUser();
        onClose();
        navigate("/dashboard")
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password, name, role, category };

    axios
      .post(`${API_URL}/auth/signup`, requestBody)
      .then(() => {
        // After successful signup, log the user in
        const loginRequestBody = { email, password };

        axios
          .post(`${API_URL}/auth/login`, loginRequestBody)
          .then((response) => {
            storeToken(response.data.authToken);
            authenticateUser();
            onClose();
            navigate("/dashboard")
          })
          .catch((error) => {
            const errorDescription = error.response.data.message;
            setErrorMessage(errorDescription);
          });
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="overlay">
      <div className="overlay-background" onClick={onClose}></div>
      <div className="overlay-content">
        {isLogin ? (
          <LoginForm
            handleLoginSubmit={handleLoginSubmit}
            handleEmail={handleEmail}
            handlePassword={handlePassword}
            email={email}
            password={password}
            errorMessage={errorMessage}
            onSwitch={onSwitch}
          />
        ) : (
          <SignUpForm
            handleSignupSubmit={handleSignupSubmit}
            handleEmail={handleEmail}
            handlePassword={handlePassword}
            handleName={handleName}
            handleRole={handleRole}
            handleCategory={handleCategory}
            email={email}
            password={password}
            name={name}
            role={role}
            category={category}
            errorMessage={errorMessage}
            onSwitch={onSwitch}
          />
        )}
      </div>
    </div>
  );
}

export default Navbar;
