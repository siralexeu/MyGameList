import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import corect al CSS-ului

const Login = ({ setUser }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { identifier, password });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setUser({ username: response.data.username });
        navigate('/profile');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login error');
    }
  };

  return (
    <div className="login-container"> {/* Aplică stilul din CSS */}
      <form onSubmit={handleLogin} className="login-form"> {/* Stil pentru formular */}
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">
          Login
        </button>
        <p>
          Don't have an account?{' '}
          <button className="register-button" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
