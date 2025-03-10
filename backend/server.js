const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./authRouter'); // Importă rutele de autentificare
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware pentru parsarea corpului cererii (body)
app.use(bodyParser.json());

// Rutele de autentificare
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Serverul rulează pe http://localhost:${port}`);
});
