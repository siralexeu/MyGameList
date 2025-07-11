const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');

app.use(cors());
app.use(express.json());

// Conectare la baza de date SQLite
const db = new sqlite3.Database('mydatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');

  // Crearea tabelelor și popularea bazei de date AICI, după conectare
  db.serialize(() => {
    // Crearea tabelului users dacă nu există
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);

    // Crearea tabelului games dacă nu există
    db.run(
      `
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        image TEXT NOT NULL,
        year INTEGER NOT NULL
      )
    `,
      (err) => {
        if (err) {
          console.error(err.message);
        }

        // Crearea tabelului user_games dacă nu există
        db.run(`
        CREATE TABLE IF NOT EXISTS user_games (
          user_id INTEGER,
          game_id INTEGER,
          status TEXT,
          platform TEXT,
          rating INTEGER,
          notes TEXT,
          PRIMARY KEY (user_id, game_id),
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (game_id) REFERENCES games(id)
        )
      `);

        // Popularea tabelului games cu câteva jocuri (dacă este gol)
        db.get('SELECT COUNT(*) AS count FROM games', (err, row) => {
          if (err) {
            console.error(err.message);
          } else {
            if (row && row.count === 0) {
              const games = [
                { name: 'Grand Theft Auto V', image: 'https://howlongtobeat.com/games/4064_Grand_Theft_Auto_V.jpg', year: 2013 },
                { name: 'The Witcher 3: Wild Hunt', image: 'https://howlongtobeat.com/games/10270_The_Witcher_3_Wild_Hunt.jpg', year: 2015 },
                { name: 'The Last of Us Part II', image: 'https://howlongtobeat.com/games/141122_The_Last_of_Us_Part_II_Remastered.jpg', year: 2020 },
                { name: 'Red Dead Redemption 2', image: 'https://howlongtobeat.com/games/27100_Red_Dead_Redemption_2.jpg', year: 2018 },
                { name: 'Cyberpunk 2077', image: 'https://howlongtobeat.com/games/Cyberpunk-2077-2.jpg', year: 2020 },
                { name: 'God of War', image: 'https://howlongtobeat.com/games/1387_God_of_War.jpg', year: 2018 },
                { name: 'Horizon Zero Dawn', image: 'https://howlongtobeat.com/games/10259_Horizon_Zero_Dawn.jpg', year: 2017 },
                { name: 'Sekiro: Shadows Die Twice', image: 'https://howlongtobeat.com/games/9852_Sekiro_Shadows_Die_Twice.jpg', year: 2019 },
                { name: 'Elden Ring', image: 'https://howlongtobeat.com/games/163494_Elden_Ring.jpg', year: 2022 },
                { name: 'Dark Souls III', image: 'https://howlongtobeat.com/games/4396_Dark_Souls_III.jpg', year: 2016 },
                { name: 'Spider-Man', image: 'https://howlongtobeat.com/games/12209_Spider-Man.jpg', year: 2018 },
                { name: 'Ghost of Tsushima', image: 'https://howlongtobeat.com/games/184682_Ghost_of_Tsushima.jpg', year: 2020 },
                { name: 'Persona 5', image: 'https://howlongtobeat.com/games/10086_Persona_5.jpg', year: 2016 },
                { name: 'The Legend of Zelda: Breath of the Wild', image: 'https://howlongtobeat.com/games/11470_The_Legend_of_Zelda_Breath_of_the_Wild.jpg', year: 2017 },
                { name: 'Super Mario Odyssey', image: 'https://howlongtobeat.com/games/13033_Super_Mario_Odyssey.jpg', year: 2017 },
                { name: 'Metroid Dread', image: 'https://howlongtobeat.com/games/180128_Metroid_Dread.jpg', year: 2021 },
                { name: 'Animal Crossing: New Horizons', image: 'https://howlongtobeat.com/games/11889_Animal_Crossing_New_Horizons.jpg', year: 2020 },
                { name: 'Death Stranding', image: 'https://howlongtobeat.com/games/12872_Death_Stranding.jpg', year: 2019 },
                { name: 'Resident Evil Village', image: 'https://howlongtobeat.com/games/166991_Resident_Evil_Village.jpg', year: 2021 },
                { name: 'Doom Eternal', image: 'https://howlongtobeat.com/games/148893_Doom_Eternal.jpg', year: 2020 }
              ];

              const insertGame = (game) => {
                const sql = `INSERT INTO games (name, image, year) VALUES (?, ?, ?)`;
                db.run(sql, [game.name, game.image, game.year], function (err) {
                  if (err) {
                    console.error(err.message);
                  } else {
                    console.log(`Inserted game: ${game.name}`);
                  }
                });
              };

              games.forEach(insertGame);
            }
          }
        });
      }
    );
  });
});

// Endpoint pentru signup
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ error: 'Error creating user' });
    }

    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

    // AICI: Folosește hashedPassword în loc de password
    db.run(sql, [username, email, hashedPassword], function (err) {
      if (err) {
        console.error('Database error:', err.message);
        // Poate ar trebui să verifici dacă eroarea este din cauza email-ului duplicat
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'User created successfully', userId: this.lastID });
    });
  });
});

// Endpoint pentru login
app.post('/api/login', (req, res) => {
  console.log('Login request received:', req.body);

  const { usernameOrEmail, password } = req.body;
  // Search for user by username or email
  const sql = `SELECT * FROM users WHERE username = ? OR email = ?`;
  console.log('SQL query:', sql);
  console.log('Query parameters:', [usernameOrEmail, usernameOrEmail]); 

  db.get(sql, [usernameOrEmail, usernameOrEmail], (err, row) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log('Query result:', row);

    if (row) {
      // User found, compare passwords
      bcrypt.compare(password, row.password, (err, result) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ error: 'Login failed' });
        }

        if (result) {
          res.json({ message: 'Login successful', user: row });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      });
    } else {
      // User not found
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Endpoint to get all games
app.get('/api/games', (req, res) => {
  const sql = `SELECT * FROM games`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Endpoint to get the user's added games.
app.get('/api/user-games/:userId', (req, res) => {
  const userId = req.params.userId; // get the ID of the user. This value will be gotten from the store in your frontend

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
app.post('/api/add-to-profile/:userId', (req, res) => {
  const { gameName, platform, rating, status, notes } = req.body;
  const userId = req.params.userId; 

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
app.delete('/api/delete-user-game/:userId/:gameId', (req, res) => {
  const userId = req.params.userId;
  const gameId = req.params.gameId;
  
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
app.put('/api/update-user-game/:userId/:gameId', (req, res) => {
  const userId = req.params.userId;
  const gameId = req.params.gameId;
  const { platform, status, rating, notes } = req.body;

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

// Endpoint to get all games with their status for a specific user
app.get('/api/users', (req, res) => {
  const sql = `
    SELECT
      u.id,
      u.username,
      SUM(CASE WHEN ug.status = 'playing' THEN 1 ELSE 0 END)    AS playingCount,
      SUM(CASE WHEN ug.status = 'planToPlay' THEN 1 ELSE 0 END) AS planToPlayCount,
      SUM(CASE WHEN ug.status = 'completed' THEN 1 ELSE 0 END)  AS completedCount
    FROM users u
    LEFT JOIN user_games ug ON u.id = ug.user_id
    GROUP BY u.id, u.username
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

//deploy
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Pornim serverul Express
app.listen(process.env.PORT || port, () => {
  console.log(`Server listening on port ${process.env.PORT || port}`);
});
