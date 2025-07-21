import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Users.css';

function UserView() {
  const { userId } = useParams();
  const [username, setUsername] = useState('');
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedGames, setDisplayedGames] = useState([]);

  // const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated'));
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || '';
  
  const statusDisplay = {
  'playing': 'Playing',
  'completed': 'Completed',
  'plantoplay': 'Plan to Play',
  'dropped': 'Dropped'
};
const platformDisplay = {
  'pc': 'PC',
  'ps5': 'PS5',
  'xbox': 'Xbox',
  'nintendoSwitch': 'Nintendo Switch'};

const formatPlatform = (platform) => {
  return platformDisplay[platform.toLowerCase()] || platform;
};

const formatStatus = (status) => {
  return statusDisplay[status.toLowerCase()] || status;
};
  
  useEffect(() => {
    const load = async () => {
      try {
        // get all users and find this one
        let res = await fetch(`${API_URL}/api/users`);
        let all = await res.json();
        let u = all.find(x => x.id === +userId);
        setUsername(u ? u.username : '');

        // get this user's games
        res = await fetch(`${API_URL}/api/user-games/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setGames(data);
          setDisplayedGames(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [userId, API_URL]);

  // search effect
  useEffect(() => {
    if (!searchTerm) {
      setDisplayedGames(games);
    } else {
      const lower = searchTerm.toLowerCase();
      setDisplayedGames(
        games.filter(g => g.name.toLowerCase().includes(lower))
      );
    }
  }, [searchTerm, games]);

  return (
    <div className="container">
      <h2>{username}&apos;s Profile</h2>
      {/* Search bar */}
      <div className="search-wrapper" style={{ margin: '16px 0' }}>
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <h3>Games:</h3>
      {displayedGames.length === 0 ? (
        <p>No games added.</p>
      ) : (
        <div className="game-list">
          {displayedGames.map(game => (
            <div key={game.id} className="game-item">
              <img
                src={game.image}
                alt={game.name}
                style={{ width: '100px' }}
              />
              <h4>{game.name}</h4>
              <p>Status: {formatStatus(game.status)}</p>
              <p>Platform: {formatPlatform(game.platform)}</p>
              <p>Rating: {game.rating}</p>
              {/* {game.notes && (
                <p>
                  <strong>Notes:</strong> {game.notes}
                </p>
              )} */}
            </div>
          ))}
        </div>
      )}

      <button onClick={() => navigate(-1)}>
        Back to Users
      </button>
    </div>
  );
}

export default UserView;