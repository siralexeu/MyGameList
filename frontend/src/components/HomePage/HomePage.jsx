import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage({ isAuthenticated }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [displayedGames, setDisplayedGames] = useState([]); 
  const [selectedGame, setSelectedGame] = useState(null); 
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Load games
    const loadGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (response.ok) {
          const data = await response.json();
          setGames(data);
          setDisplayedGames(data); 
        } else {
          console.error('Failed to load games');
        }
      } catch (error) {
        console.error('Error loading games:', error);
      }
    };
    loadGames();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setDisplayedGames(games);
    } else {
      const filtered = games.filter((game) =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedGames(filtered);
    }
    setSelectedGame(null);
  }, [searchTerm, games]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddToProfile = (gameName) => {
    if (isAuthenticated) {
      navigate(`/addgame/${gameName}`);
    } else {
      navigate('/login');
    }
  };

  const handleGameClick = (game) => {
    if (selectedGame && selectedGame.id === game.id) {
      setSelectedGame(null); 
    } else {
      setSelectedGame(game); 
    }
  };

  const sortGames = (order) => {
    const sortedGames = [...displayedGames].sort((a, b) => {
      if (order === 'asc') {
        return a.name.localeCompare(b.name); 
      } else {
        return b.name.localeCompare(a.name); 
      }
    });
    setDisplayedGames(sortedGames);
  };

  return (
    <div className="container">

      <div className="filters">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />

        <div className="filter-group">
          <label htmlFor="sort-order">Sort:</label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => {
              const newOrder = e.target.value;
              setSortOrder(newOrder);
              sortGames(newOrder);
            }}
            className="filter-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="game-list">
        {displayedGames.map((game) => (
          <div
            key={game.id}
            className="game-item" 
            onClick={() => handleGameClick(game)}
            style={{ cursor: 'pointer', marginBottom: '20px' }} 
          >
            <img src={game.image} alt={game.name} style={{ width: '100px' }} /> 
            <h3>{game.name}</h3>
            <p>Release date: {game.year}</p>

            {selectedGame && selectedGame.id === game.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToProfile(game.name);
                }}
                className="add-to-profile-button"
              >
                Add to Your Profile
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
