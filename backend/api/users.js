const express = require('express');
const router = express.Router();

// Endpoint to get all games with their status for a specific user
router.get('/users', (req, res) => {
  const db = req.app.locals.db;
  
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

module.exports = router;