const express = require('express');
const router = express.Router();

// Endpoint to get the user's added games.
router.get('/user-games/:userId', (req, res) => {
  const userId = req.params.userId; // get the ID of the user. This value will be gotten from the store in your frontend
  const db = req.app.locals.db;

  const sql = `
    SELECT games.id, games.name, games.image, games.year, 
           user_games.status, user_games.platform, user_games.rating, user_games.notes
    FROM games
    INNER JOIN user_games ON games.id = user_games.game_id
    WHERE user_games.user_id = ?
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Endpoint to handle adding a game to a user's profile
router.post('/add-to-profile/:userId', (req, res) => {
  const { gameName, platform, rating, status, notes } = req.body;
  const userId = req.params.userId; 
  const db = req.app.locals.db;

  // Find the game id based on your information.
  const getGameId = `SELECT id FROM games WHERE name = ?`;

  db.get(getGameId, [gameName], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      const gameId = row.id;
      const sql = `INSERT INTO user_games (user_id, game_id, status, platform, rating, notes) VALUES (?, ?, ?, ?, ?, ?)`;

      //Now implement the SQL to INSERT into user_games the relevant data from users and games tables.
      db.run(sql, [userId, gameId, status, platform, rating, notes], function (err) {
        if (err) {
          console.error(err.message);
          if (
            err.message.includes(
              'UNIQUE constraint failed: user_games.user_id, user_games.game_id'
            )
          ) {
            return res
              .status(409)
              .json({ error: 'This game is already on your profile.' });
          }
          return res.status(500).json({ error: err.message }); 
        }
        
        //console.log(`Added game id ${gameId} for user id ${userId} with status ${status}`);
        res.json({ message: 'Game added to profile successfully' });
      });
    } else {
      console.log('Could not find this game! ' + row);
    }
  });
});

// Endpoint to remove a game from a user's profile
router.delete('/delete-user-game/:userId/:gameId', (req, res) => {
  const userId = req.params.userId;
  const gameId = req.params.gameId;
  const db = req.app.locals.db;
  
  const sql = `DELETE FROM user_games WHERE user_id = ? AND game_id = ?`;
  
  db.run(sql, [userId, gameId], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes > 0) {
      res.json({ message: 'Game removed from profile successfully' });
    } else {
      res.status(404).json({ error: 'Game not found in user profile' });
    }
  });
});

// Endpoint to edit a game from a user's profile
router.put('/update-user-game/:userId/:gameId', (req, res) => {
  const userId = req.params.userId;
  const gameId = req.params.gameId;
  const { platform, status, rating, notes } = req.body;
  const db = req.app.locals.db;

  const sql = `
    UPDATE user_games
    SET platform = ?,
        status = ?,
        rating = ?,
        notes = ?
    WHERE user_id = ? AND game_id = ?
  `;

  db.run(sql, [platform, status, rating, notes, userId, gameId], function (err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes > 0) {
      res.json({ message: 'Game updated successfully' });
    } else {
      res.status(404).json({ error: 'Game not found in user profile' });
    }
  });
});

module.exports = router;