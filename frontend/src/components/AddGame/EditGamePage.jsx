import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function EditGamePage() {
  const [platform, setPlatform] = useState('');
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { gameId } = useParams();
  const location = useLocation();
  const gameData = location.state?.gameData;

  useEffect(() => {
    if (!gameData) {
      navigate('/profile');
    } else {
      setPlatform(gameData.platform || '');
      setStatus(gameData.status || '');
      setRating(gameData.rating || '');
      setNotes(gameData.notes || '');
    }
  }, [gameData, navigate], []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!userId) {
      setMessage('User not logged in.');
      navigate('/login');
      return;
    }

    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setMessage('Authentication token missing.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`/api/update-user-game/${userId}/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          platform,
          status,
          rating,
          notes,
        }),
      });

      if (response.ok) {
        setMessage('Game updated successfully!');
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      } else {
        const errorData = await response.json().catch(() => null);
        setMessage(
          errorData && errorData.error
            ? `Error: ${errorData.error}`
            : 'Failed to update game. Please try again.'
        );
      }
    } catch (error) {
      setMessage('An error occurred while updating the game.');
      console.error('Error during game update:', error);
    }
  };

  return (
    <div className="add-game-container">
      <h2>Edit {gameData?.name}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="platform">Platform:</label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required
          >
            <option value="">Select Platform</option>
            <option value="pc">PC</option>
            <option value="ps5">PS5</option>
            <option value="xbox">Xbox</option>
            <option value="nintendoSwitch">Nintendo Switch</option>
          </select>
        </div>

        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="playing">Playing</option>
            <option value="completed">Completed</option>
            <option value="planToPlay">Plan to Play</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>

        <div>
          <label htmlFor="rating">Rating (1-10):</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
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
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Update Game
          </button>
          <button type="button" className="back-button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </form>
      {message && (
        <p className={message.startsWith('Game updated successfully!') ? 'success' : 'error'}>
          {message}
        </p>
      )}
    </div>
  );
}

export default EditGamePage;