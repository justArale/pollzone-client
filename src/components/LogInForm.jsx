import React from 'react';
import { Link } from 'react-router-dom';
import './LogInForm.css';

const LogInForm = ({ handleLoginSubmit, handleEmail, handlePassword, email, password, errorMessage, onSwitch }) => {
  return (
    <div className="login-form-container">
      <form onSubmit={handleLoginSubmit} className="login-form">
        <h3>Log In</h3>

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

        <button type="submit" className='button'>Log In</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Don't have an account? <a href="#" onClick={onSwitch}>
          Sign Up
        </a></p>
    </div>
  );
};

export default LogInForm;
