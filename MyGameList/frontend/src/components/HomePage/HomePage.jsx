import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage({ isAuthenticated }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [displayedGames, setDisplayedGames] = useState([]); // State to hold the games currently being displayed
  const [selectedGame, setSelectedGame] = useState(null); // State to track the clicked game
  const navigate = useNavigate();

  useEffect(() => {
    // Load games
    const loadGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games');
        if (response.ok) {
          const data = await response.json();
          setGames(data);
          setDisplayedGames(data); // Initially display all games
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
    // Filter games whenever searchTerm changes
    if (searchTerm === '') {
      // If search term is empty, display all games
      setDisplayedGames(games);
    } else {
      // If there's a search term, filter based on the full games list
      const filtered = games.filter((game) =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedGames(filtered);
    }
    // Reset selected game when search term changes to avoid showing a button for a filtered-out game
    setSelectedGame(null);
  }, [searchTerm, games]); // Depend on searchTerm and the full games list

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
      setSelectedGame(null); // Collapse if clicking the same game
    } else {
      setSelectedGame(game); // Select this game
    }
  };

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search games..."
        value={searchTerm}
        onChange={handleSearch}
      />

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
                  e.stopPropagation(); // Prevent clicking the button from triggering the game click
                  handleAddToProfile(game.name);
                }}
                // Use a class for button styling to keep it consistent with CSS
                className="add-to-profile-button"
                // Remove inline styles if you want to rely purely on CSS
                // style={{ backgroundColor: 'blue', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none' }}
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
