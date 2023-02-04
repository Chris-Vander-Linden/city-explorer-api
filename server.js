'use strict';

// set hidden global vars from .env file
require('dotenv').config();
const PORT = process.env.PORT || 5005;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

// create express app
const express = require('express');
const app = express();

// pass cors into express app, listen on port
const cors = require('cors');
app.use(cors());
app.listen(PORT, () => console.log(`Listening on...`, `http://localhost:${PORT}/`));

// axios for external API
const axios = require('axios');

/*** ROUTE START ***/

/* Root Route */

// app instance get method takes path and callback function.
app.get('/', (req, res) => {
  // Local: http://localhost:3003/
  // Remote: https://city-explorer-api-jqdk.onrender.com/

  // Then we need to send something back.
  // This prints it to the screen
  res.send('This is the Home route!!!!');
});


/* Weather API Routes */

app.get('/weatherAPI', (req, res) => {
  console.log(req.query);
  const { lat, lon } = req.query;
  // default return next 48 hours
  axios.get(`https://api.weatherbit.io/v2.0/forecast/hourly?lat=${lat}&lon=${lon}&units=I&key=${WEATHER_API_KEY}`).then(response => {
    // loop through objects
    const dataToSend = response.data.data.map(data => new WeatherForecast(data, response.data.timezone));
    //console.log(dataToSend);
    // This sends the data as JSON?
    res.send(dataToSend);
  }).catch(error => {
    res.status(500).send(error);
    console.error(error);
  });
});

/* Movie Routes */
app.get('/movieAPI', (req, res) => {
  const cityName = req.query.cityName;

  console.log(cityName);

  // Get image base path, so I can later form full path
  axios.get(`https://api.themoviedb.org/3/configuration?api_key=${MOVIE_API_KEY}`).then(response => {
    const basePathData = { thumb_img_url: response.data.images.base_url + response.data.images.poster_sizes[0], large_img_url: response.data.images.base_url + response.data.images.poster_sizes[response.data.images.poster_sizes.length - 1] };

    // Get movie data
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${cityName}`).then(response => {
      const dataToSend = response.data.results.map(movie => new Movie(movie, basePathData));
      res.send(dataToSend);
    }).catch(error => {
      res.status(500).send(error);
      console.error(error);
    });
  }).catch(error => {
    res.status(500).send(error);
    console.error(error);
  });
});

/* Food Routes */
app.get('/foodAPI', (req, res) => {
  res.send('FoodAPI ROUTE!!!');
});

// 404 not found path.
app.get('*', (request, response) => {
  response.status(404).send('The route was not found. Error 404');
});

/*** ROUTE END ***/




/* Classes */

class WeatherForecast {
  constructor (arrayObject) {
    this.time = new Date(arrayObject.timestamp_local).toLocaleString('en-US', { hour: 'numeric' });
    this.icon = arrayObject.weather.icon;
    this.desc = arrayObject.weather.description;
    this.temp = `${arrayObject.temp} \u2109`;
    this.direction = arrayObject.wind_cdir;
    this.speed = arrayObject.wind_spd + ' MPH';
    this.gust = arrayObject.wind_gust_spd + ' MPH';
    this.precip = arrayObject.precip + '"';
  }
}

class Movie {
  constructor (arrayObject, basePathDataObj) {
    this.id = arrayObject.id;
    this.cover = basePathDataObj.thumb_img_url + arrayObject.poster_path;
    this.title = arrayObject.title;
    this.cover_large = basePathDataObj.large_img_url + arrayObject.poster_path;
    this.overview = arrayObject.overview;
    this.vote = ((Number.parseInt(arrayObject.vote_average) / 10) * 100) + '%';
    this.release = arrayObject.release_date;
  }
}

/*
class Food {
  constructor (arrayObject) {
    this.time = arrayObject.timestamp_local;
  }
}
*/

/* Errors */
// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});
