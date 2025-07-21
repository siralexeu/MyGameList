const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const saltRounds = 10;

// Endpoint pentru signup
router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  const db = req.app.locals.db;

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
router.post('/login', (req, res) => {
  console.log('Login request received:', req.body);

  const { usernameOrEmail, password } = req.body;
  const db = req.app.locals.db;
  
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

module.exports = router;