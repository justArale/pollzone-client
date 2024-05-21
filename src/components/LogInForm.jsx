import React from 'react';
import { Link } from 'react-router-dom';

const LogInForm = ({ handleLoginSubmit, handleEmail, handlePassword, email, password, errorMessage }) => {
  return (
    <div style={{
      padding: '20px',
      margin: '20px auto',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      maxWidth: '600px'
    }}>

      <form
        onSubmit={handleLoginSubmit}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px',
          marginTop: '10px'
        }}
      >
        <h3 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '24px'
        }}>
          Log In
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <label htmlFor="email" style={{
            color: '#666',
            marginBottom: '8px',
            fontWeight: '600'
          }}>Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleEmail}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '100%',
              marginBottom: '16px'
            }}
            autoComplete="off"
          />
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <label htmlFor="password" style={{
            color: '#666',
            marginBottom: '8px',
            fontWeight: '600'
          }}>Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handlePassword}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '100%',
              marginBottom: '16px'
            }}
            autoComplete="off"
          />
        </div>

        <button type="submit" style={{
          backgroundColor: '#007bff',
          color: 'white',
          fontWeight: '600',
          padding: '12px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}>Log In</button>
      </form>

      {errorMessage && <p style={{ color: 'red', marginTop: '16px' }}>{errorMessage}</p>}

      <p style={{ marginTop: '40px' }}>Don't have an account?</p>
      <Link to="/signup">Sign Up</Link>
    </div>
  );
};

export default LogInForm;
