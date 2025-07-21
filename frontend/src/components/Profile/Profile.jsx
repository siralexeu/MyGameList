import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Profile({ handleLogout }) {
  const [username, setUsername] = useState('');
  const [userGames, setUserGames] = useState([]);
  const [displayedGames, setDisplayedGames] = useState([]);
  const [expandedGameId, setExpandedGameId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || '';
  const platformDisplay = {
  'pc': 'PC',
  'ps5': 'PS5',
  'xbox': 'Xbox',
  'nintendoSwitch': 'Nintendo Switch'
};

const statusDisplay = {
  'playing': 'Playing',
  'completed': 'Completed',
  'plantoplay': 'Plan to Play',
  'dropped': 'Dropped'
};
const formatPlatform = (platform) => {
  return platformDisplay[platform.toLowerCase()] || platform;
};

const formatStatus = (status) => {
  return statusDisplay[status.toLowerCase()] || status;
};

  useEffect(() => {
    // Fetch user data and games from the API
    const fetchProfileData = async () => {
      const storedUser = localStorage.getItem('user'); // Obține user info
      const storedToken = localStorage.getItem('token'); // Obține token-ul

      if (storedUser && storedToken) { // Verifică și token-ul
        const user = JSON.parse(storedUser);
        setUsername(user.username);
        const userId = user.id; // Obține userId din obiectul user stocat

        try {
          // Modifică URL-ul - FOLOSEȘTE userId CA PARAMETRU MOMENTAN
          const response = await fetch(`${API_URL}/api/user-games/${userId}`, {
            headers: {
              'Authorization': `Bearer ${storedToken}` // Adaugă token-ul în antet
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log('User games data:', data);
            setUserGames(data);
            setDisplayedGames(data); 
          } else if (response.status === 401 || response.status === 403) {
             console.error('Authentication error:', response.status, response.statusText);
             handleLogout(); 
             navigate('/login'); 
          } else {
            console.error('Failed to load user games:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error loading user games:', error);
        }
      } else {
        // Utilizatorul nu este logat (nu există token sau user info)
        handleLogout(); 
        navigate('/login'); 
      }
    };

    fetchProfileData();
  }, [location, handleLogout, navigate, API_URL]); 

  useEffect(() => {
  let filteredGames = [...userGames];

  if (searchTerm) {
    filteredGames = filteredGames.filter(game =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

if (statusFilter !== 'all') {
    filteredGames = filteredGames.filter(game => 
      game.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }

  if (platformFilter !== 'all') {
    filteredGames = filteredGames.filter(game => 
      game.platform.toLowerCase() === platformFilter.toLowerCase()
    );
  }

  setDisplayedGames(filteredGames);
}, [searchTerm, statusFilter, platformFilter, userGames]);


  const toggleDetails = (gameId) => {
    if (expandedGameId === gameId) {
      setExpandedGameId(null);
    } else {
      setExpandedGameId(gameId);
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (window.confirm("Are you sure you want to delete this game from your profile?")) {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token'); 

        if (!storedUser || !storedToken) { 
            handleLogout();
            navigate('/login');
            return; 
        }

        const userId = JSON.parse(storedUser).id; 

        try {
          const response = await fetch(`${API_URL}/api/delete-user-game/${userId}/${gameId}`, { 
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${storedToken}` // Adaugă token-ul în antet
            }
          });

          if (response.ok) {
            // Remove the game from the local state
            const updatedGames = userGames.filter(game => game.id !== gameId);
            setUserGames(updatedGames);
            setDisplayedGames(updatedGames.filter(game => {
              // Aplicăm filtrele curente
              let matchesSearch = !searchTerm || game.name.toLowerCase().includes(searchTerm.toLowerCase());
              let matchesStatus = statusFilter === 'all' || game.status === statusFilter;
              let matchesPlatform = platformFilter === 'all' || game.platform === platformFilter;
              return matchesSearch && matchesStatus && matchesPlatform;
            }));
          } else if (response.status === 404) {
             console.error('Game not found in profile');
          } else {
            console.error('Failed to delete game from profile', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error deleting game:', error);
           // Gestiune eroare rețea
        }
      }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePlatformFilter = (e) => {
    setPlatformFilter(e.target.value);
  };

  return (
    <div className="container">
      <h2>My Profile</h2>
      {username ? <p>Welcome, {username}!</p> : <p>Welcome!</p>}
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilter}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="playing">Playing</option>
            <option value="completed">Completed</option>
            <option value="plantoplay">Plan to Play</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="platform-filter">Platform:</label>
          <select
            id="platform-filter"
            value={platformFilter}
            onChange={handlePlatformFilter}
            className="filter-select"
          >
            <option value="all">All Platforms</option>
            <option value="pc">PC</option>
            <option value="ps5">PS5</option>
            <option value="xbox">Xbox</option>
            <option value="nintendoSwitch">Nintendo Switch</option>
          </select>
        </div>
      </div>

      <h3>My Games:</h3>
      {displayedGames.length === 0 ? (
        userGames.length === 0 ? (
          <p>No games added to your profile yet.</p>
        ) : (
          <p>No games found matching your criteria.</p>
        )
      ) : (
        <div className="game-list">
          {displayedGames.map((game) => (
            <div key={game.id} className="game-item">
              <img src={game.image} alt={game.name} style={{ width: '100px' }} />
              <h4>{game.name}</h4>
              <p>Status: {formatStatus(game.status)}</p>
              <p>Platform: {formatPlatform(game.platform)}</p>
              <p>Rating: {game.rating}</p>
              {expandedGameId === game.id && (
                <div className="game-notes">
                  <p><strong>Notes:</strong> {game.notes || 'No notes provided'}</p>
                  <button
                    className="edit-button"
                    onClick={() =>
                      navigate(`/edit-game/${game.id}`, {
                        state: { gameData: game }
                      })
                    }
                  >
                    Edit
                  </button>
                </div>
              )}
              <div className="button-group">
                <button 
                  className="details-button"
                  onClick={() => toggleDetails(game.id)}
                >
                  {expandedGameId === game.id ? 'Hide Details' : 'Details'}
                </button>
                
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteGame(game.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
