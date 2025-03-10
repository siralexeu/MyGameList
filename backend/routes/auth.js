const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Importă conexiunea la baza de date
require('dotenv').config();
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

// Înregistrare utilizator
router.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;

    // Validarea inputurilor
    if (!email || !username || !password) {
        return res.status(400).json({ message: 'Email, username și parola sunt necesare' });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Email invalid' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Parola trebuie să aibă cel puțin 8 caractere' });
    }

    try {
        const existingUser = await db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);

        if (existingUser) {
            return res.status(400).json({ message: 'Email sau username deja utilizat' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, hashedPassword]);

        res.json({ message: 'Utilizator înregistrat cu succes' });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la înregistrare' });
    }
});

// Login utilizator
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body; // Poate fi email sau username

    try {
        const user = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', [identifier, identifier]);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Email/Username sau parola incorectă' });
        }

        const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY, { expiresIn: '24h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la autentificare' });
    }
});

module.exports = router;
