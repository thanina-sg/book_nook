const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT id, username, role FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err || !row) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ message: 'Login successful', user: row });
  });
});

// Book APIs
app.get('/api/books', (req, res) => {
  db.all('SELECT * FROM books', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/books', (req, res) => {
  const { title, author, genre, price, stock } = req.body;
  db.run(
    'INSERT INTO books (title, author, genre, price, stock) VALUES (?, ?, ?, ?, ?)',
    [title, author, genre, price, stock],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, author, genre, price, stock });
    }
  );
});

app.delete('/api/books/:id', (req, res) => {
  db.run('DELETE FROM books WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Book deleted' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));