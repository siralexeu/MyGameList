import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


function Login({ setIsAuthenticated }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });
      const data = await response.json();

      if (response.ok) {
        // Login successful
        console.log('Login successful');
        // Data de la backend conține user info (inclusiv ID) și token-ul
        const { user, token } = data; 

        // Stochează user info (cu ID) și token-ul în localStorage
        localStorage.setItem('user', JSON.stringify(user)); // Stochează user info (inclusiv ID)
        localStorage.setItem('token', token); // Stochează token-ul

        setIsAuthenticated(true); // Setează starea de autentificare
        navigate('/home'); // Redirecționează către pagina principală
      } else {
        // Login failed
        console.error('Login failed');
        setErrorMessage(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred during login.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username or Email:</label>
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <Link to="/signup" className="link">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default Login;
