<<<<<<< HEAD
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routes.js');
const cors = require('cors');
=======
import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/routes.js';
>>>>>>> origin/frontend

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3002;

app.use('/', router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

