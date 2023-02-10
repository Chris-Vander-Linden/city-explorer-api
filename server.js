'use strict';

const express = require('express');
const cors = require('cors');
// set hidden global vars from .env file
require('dotenv').config();

const homeResponse = require('./modules/home.js');
const getWeatherData = require('./modules/weather.js');
const getMovieData = require('./modules/movies.js');
const getYelpData = require('./modules/yelp.js');
const unknownPageResponse = require('./modules/404');

const PORT = process.env.PORT || 5005;
// create express app
const app = express();

// pass cors into express app, listen on port
app.use(cors());
app.listen(PORT, () => console.log(`Listening on...`, `http://localhost:${PORT}/`));

// routes
app.get('/', homeResponse);
app.get('/weatherAPI', getWeatherData);
app.get('/movieAPI', getMovieData);
app.get('/yelp', getYelpData);
app.get('*', unknownPageResponse);

/* Errors */
app.use((error, request, response) => {
  response.status(500).send(error.message);
});
