import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import "./Navbar.css";
import logo from "../assets/images/LogoPollZone.png";

function Navbar() {
  const location = useLocation();
  const { isLoggedIn, logOutUser } = useContext(AuthContext);

  const getCurrentLinkText = (pathname) => {
    const routes = {
      "/dashboard": "Startpage",
      "/profile": "User Profile",
      "/login": "Log In",
      "/signup": "Sign Up",
    };

    for (let route in routes) {
      let regexPattern = new RegExp("^" + route.replace(/:\w+/g, "\\w+") + "$");
      if (regexPattern.test(pathname)) {
        return routes[route];
      }
    }
    return "";
  };

  return (
    <nav>
      <div className="headerBar">
        <div>
          {isLoggedIn && (
            <div>
              <Link to="/dashboard">
                <img src={logo} />
              </Link>
            </div>
          )}
          <div>
            {!isLoggedIn && (
              <div>
                <Link to="/">
                  <img src={logo} />
                </Link>
              </div>
            )}
          </div>
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
            {isLoggedIn && <button onClick={logOutUser}>Log Out</button>}
            <div>
              {!isLoggedIn &&
                location.pathname !== "/login" &&
                location.pathname !== "/signup" && (
                  <div>
                    <Link to="/login">
                      <button className="button buttonSmall">Log In</button>
                    </Link>
                    {/* 
                    <Link to="/signup">
                      <button>Sign Up</button>
                    </Link> */}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
