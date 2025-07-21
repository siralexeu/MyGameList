const express = require('express');
const router = express.Router();

// Endpoint to get all games
router.get('/games', (req, res) => {
  const sql = `SELECT * FROM games`;
  const db = req.app.locals.db;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;