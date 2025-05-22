import React from 'react';

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/'; // backend auth route
  };

  return (
    <div className="text-center mt-5">
      <h2>Login with Microsoft</h2>
      <button className="btn btn-primary mt-3" onClick={handleLogin}>
        Sign In with Microsoft
      </button>
    </div>
  );
};

export default Login;
