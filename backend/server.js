const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');

const authRoutes = require('./api/auth');
const gameRoutes = require('./api/games');
const userGameRoutes = require('./api/userGames');
const userRoutes = require('./api/users');

const app = express();
const port = 5000;
const saltRounds = 10;

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

// Make db available to routes
app.locals.db = db;

// Routes
app.use('/api', authRoutes);
app.use('/api', gameRoutes);
app.use('/api', userGameRoutes);
app.use('/api', userRoutes);

// Health check pentru Railway (ADAUGĂ AICI!)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const path = require('path');

// Servește frontend-ul React
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Pornim serverul Express
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
