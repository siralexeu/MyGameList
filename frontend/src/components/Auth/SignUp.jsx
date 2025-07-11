import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importă useNavigate

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Folosește useNavigate pentru redirecționare

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json(); // Parsează răspunsul

      if (response.ok) {
        // Signup successful
        console.log('Signup successful', data);
        // Redirecționează către pagina de login după signup reușit
         navigate('/login'); 
      } else {
        // Signup failed
        console.error('Signup failed', data);
        // Poți gestiona eroarea aici, dar fără a afișa un mesaj specific pe pagină
        // De exemplu, poți arunca o alertă simplă:
         alert(data.error || 'Signup failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      // Poți gestiona eroarea aici, dar fără a afișa un mesaj specific pe pagină
      // De exemplu, poți arunca o alertă simplă:
       alert('An error occurred during signup.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{' '}
        <Link to="/login" className="link">
          Login
        </Link>
      </p>
    </div>
  );
}

export default SignUp;
