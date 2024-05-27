import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

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
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#006bb3", // Purple color
        padding: "10px 20px",
        color: "white",
      }}
    >
      <div style={{ display: "flex" }}>
        {/* <Link to="/signup" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Sign Up</Link>
            <Link to="/login" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Log In</Link> */}
        {isLoggedIn && (
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>
            <Link
              to="/dashboard"
              style={{ color: "white", textDecoration: "none" }}
            >
              PollZone
            </Link>
          </div>
        )}
        <div>
          {!isLoggedIn && (
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>
              <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                PollZone
              </Link>
            </div>
          )}
        </div>
      </div>
      <div>
        <Link
          to="/about"
          style={{ color: "white", margin: "0 10px", textDecoration: "none" }}
        >
          About
        </Link>
        <Link
          to="/creators"
          style={{ color: "white", margin: "0 10px", textDecoration: "none" }}
        >
          All Creators
        </Link>
        <Link
          to="/projects"
          style={{ color: "white", margin: "0 10px", textDecoration: "none" }}
        >
          All Projects
        </Link>
        <Link
          to="/profile"
          style={{ color: "white", margin: "0 10px", textDecoration: "none" }}
        >
          My Profile
        </Link>
      </div>
      <div style={{ display: "flex" }}>
        {/* <Link to="/signup" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Sign Up</Link>
            <Link to="/login" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Log In</Link> */}
        {isLoggedIn && (
          <button
            className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-400"
            onClick={logOutUser}
          >
            Log Out
          </button>
        )}
        <div>
          {!isLoggedIn &&
            location.pathname !== "/login" &&
            location.pathname !== "/signup" && (
              <div>
                <Link to="/login">
                  <button className="px-6 py-1 rounded bg-blue-500 text-white hover:bg-blue-400">
                    Log In
                  </button>
                </Link>

                <Link to="/signup">
                  <button className="px-6 py-1 rounded bg-blue-500 text-white hover:bg-blue-400">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

/*
 setShowOverlay(true)
*/
