import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/routes.js';

const app = express();
app.use(bodyParser.json());

const port = 3002;

app.use('/', router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

