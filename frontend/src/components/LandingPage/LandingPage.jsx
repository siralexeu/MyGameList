import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <h1>My Game List</h1>
      <p>Welcome</p>
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
}

export default LandingPage;
