import React, { useState } from 'react';
import SignUpForm from '../components/SignUpForm';



function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
  
    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handleName = (e) => setName(e.target.value);
    const handleRole = (e) => setRole(e.target.value);
  
    const handleSignupSubmit = (e) => {
      e.preventDefault();
      // Implement signup logic here
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

export default SignUpPage