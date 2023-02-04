'use strict';

// set hidden global vars from .env file
require('dotenv').config();
const PORT = process.env.PORT || 5005;

const homeResponse = require('./modules/home.js');
const getWeatherData = require('./modules/weather.js');
const getMovieData = require('./modules/movies.js');
const getFoodData = require('./modules/food.js');
const unknownPageResponse = require('./modules/404');

// create express app
const express = require('express');
const app = express();

// pass cors into express app, listen on port
const cors = require('cors');
app.use(cors());
app.listen(PORT, () => console.log(`Listening on...`, `http://localhost:${PORT}/`));

app.get('/', homeResponse);
app.get('/weatherAPI', getWeatherData);
app.get('/movieAPI', getMovieData);
app.get('/foodAPI', getFoodData);
app.get('*', unknownPageResponse);

/* Errors */
app.use((error, request, response) => {
  response.status(500).send(error.message);
});
