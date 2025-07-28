import express from 'express';
import mysql from 'mysql2'
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

import 'dotenv/config';

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
const port = 3002;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/cash', (req, res) => {
  connection.query('SELECT * FROM cash', (err, results) => {
    if (err) {
      console.error('Error fetching cash records:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});
