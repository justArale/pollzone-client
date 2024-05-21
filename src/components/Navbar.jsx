import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#6a0dad', // Purple color
            padding: '10px 20px',
            color: 'white',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>POLLZONE</Link>
          </div>
          <div>
            <Link to="/about" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>About</Link>
            <Link to="/creators" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>All Creators</Link>
            <Link to="/projects" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>All Projects</Link>
          </div>
          <div style={{ display: 'flex' }}>
            <Link to="/signup" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Sign Up</Link>
            <Link to="/login" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Log In</Link>

          </div>
        </nav>
      );
}

export default Navbar;
