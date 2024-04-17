import express from 'express';
import morgan from 'morgan';

import { googleImageSearch, googleSearch } from './googlethis';

import config from '../shared/config.json';

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.get('/', (_, res) => {
  res.send('Hello World');
});

app.post('/search', googleSearch);

app.get('/image', googleImageSearch);

app.listen(config.googlethis.port, () => {
  console.log('Server is running on port ' + config.googlethis.port);
});
