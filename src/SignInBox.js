import React from 'react';
import logo from './react-logo.png'; // Replace with the path to your React logo image

const SignInBox = ({ email, password, setEmail, setPassword, handleSignIn, handleCreateAccount }) => {
  return (
    <div className="sign-in-box">
      <img src={logo} alt="React Logo" className="react-logo" style={{ width: '500px', height: '400px' }}/>
      <div className="input-container">
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="input-container">
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="button-container">
        <button onClick={handleSignIn}>Sign In</button>
        <button onClick={handleCreateAccount}>Create Account</button>
      </div>
    </div>
  );
};

export  {SignInBox};
