import React, { useState } from 'react';
import LoginForm from '../components/LogInForm';

const LogInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Implement login logic here
    // If there's an error, set the error message:
    // setErrorMessage('Some error message');
  };

  return (
    <LoginForm
      handleLoginSubmit={handleLoginSubmit}
      handleEmail={handleEmail}
      handlePassword={handlePassword}
      email={email}
      password={password}
      errorMessage={errorMessage}
    />
  );
};

export default LogInPage;
