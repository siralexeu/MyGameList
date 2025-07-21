import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function AddGamePage() {
  const [platform, setPlatform] = useState('');
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState(''); // Use a single state for messages (success or error)
  const [userId, setUserId] = useState(null); // State pentru a stoca userId
  const navigate = useNavigate();
  const { gameName } = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id); // Setează userId din localStorage
    } else {
      // Dacă utilizatorul nu este logat, redirecționează la login
      navigate('/login');
    }
  }, [navigate]); // Adaugă navigate la dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    if (!userId) {
      setMessage('User not logged in.');
      // Redirecționează la login dacă nu e logat (redundant cu useEffect, dar pentru siguranță)
       navigate('/login'); 
      return;
    }

    const storedToken = localStorage.getItem('token'); // Obține token-ul

    if (!storedToken) {
        // Utilizatorul nu este logat (ar trebui prins deja de useEffect)
        setMessage('Authentication token missing.');
        navigate('/login');
        return;
    }

    try {
      // URL-ul corect cu userId
      const response = await fetch(`/api/add-to-profile/${userId}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}` // Adaugă token-ul în antet
        },
        body: JSON.stringify({
          gameName: gameName,
          platform: platform,
          status: status,
          rating: rating,
          notes: notes,
        }),
      });

      if (response.ok) {
        setMessage('Game added successfully!');
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      } else if (response.status === 409) { // Assuming backend returns 409 for duplicate
        const errorData = await response.json().catch(() => null); // Safely parse JSON
        setMessage(errorData && errorData.error ? `Error: ${errorData.error}` : `Error: "${gameName}" is already in your profile.`);
      }
       else {
        const errorData = await response.json().catch(() => null); // Safely parse JSON
        setMessage(errorData && errorData.error ? `Error: ${errorData.error}` : 'Failed to add game to profile. Please try again.');
        console.error('Failed to add game to profile:', response.status, response.statusText);
      }
    } catch (error) {
      setMessage('An error occurred while adding the game.');
      console.error('Error during game addition:', error);
    }
  };

  return (
    <div className="add-game-container">
      <h2>Add {gameName} to Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="platform">Platform:</label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required // Make platform selection required
          >
            <option value="">Select Platform</option>
            <option value="pc">PC</option>
            <option value="ps5">PS5</option>
            <option value="xbox">Xbox</option>
            <option value="nintendoSwitch">Nintendo Switch</option>
            {/* Add more platforms as needed */}
          </select>
        </div>

        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required // Make status selection required
          >
            <option value="">Select Status</option>
            <option value="playing">Playing</option>
            <option value="completed">Completed</option>
            <option value="planToPlay">Plan to Play</option>
            <option value="dropped">Dropped</option>
            {/* Add more status options as needed */}
          </select>
        </div>

        <div>
          <label htmlFor="rating">Rating (1-10):</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            // Rating can be optional, so no 'required'
          >
            <option value="">Select Rating</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="4" // Adjust as needed
          />
        </div>

        {/* <button type="submit">Add to Profile</button> */}
        <div className="form-actions">      
          <button type="submit" className="submit-button">
            Add to Profile
          </button>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </form>
      {/* Display the message */}
      {message && <p className={message.startsWith('Game added successfully!') ? 'success' : 'error'}>{message}</p>}
    </div>
  );
}

export default AddGamePage;
