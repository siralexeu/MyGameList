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
  