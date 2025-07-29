const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routes.js');

const app = express();
app.use(bodyParser.json());

const port = 3002;

app.use('/', router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

