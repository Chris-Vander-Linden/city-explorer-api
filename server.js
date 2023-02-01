'use strict';

// set hidden global vars from .env file
require('dotenv').config();
const PORT = process.env.PORT || 5005;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// create express app
const express = require('express');
const app = express();

// pass cors into express app, listen on port
const cors = require('cors');
app.use(cors());
app.listen(PORT, () => console.log(`Listening on...`, `http://localhost:${PORT}/`));

// axios for external API
const axios = require('axios');


/*** DATA START ***/
// import practice data
let data = require('./data/weather.json');


/*** DATA END ***/










/*** ROUTE START ***/

/* (Practice) Weather Routes */

// app instance get method takes path and callback function.
app.get('/', (request, response) => {
  //http://localhost:3003/

  //then we need to send something back
  response.send('Hefffllo from our server HOME route / !!!');
});

app.get('/weather', (request, response) => {
  //http://localhost:3003/weather?searchQuery=Seattle

  try {
    // destructure query from request
    let { searchQuery, lat, lon } = request.query;

    // find matching city
    let dataToInstantiate = data.find(city => {
      return city.city_name === searchQuery || (city.lat === lat && city.lon === lon);
    });

    // loop through objects
    let dataToSend = dataToInstantiate.data.map(data => new Forecast(data));

    response.status(200).send(dataToSend);

  } catch (error) {
    //create a new instance of error
    //this will instantiate any new error
    // eslint-disable-next-line no-undef
    next(error);
  }
});

/* Weather API Routes */

app.get('/weatherAPI', (req, res) => {
  console.log(req.query);
  const { lat, lon } = req.query;

  // default return next 48 hours
  axios.get(`https://api.weatherbit.io/v2.0/forecast/hourly?lat=${lat}&lon=${lon}&units=[I]&key=${WEATHER_API_KEY}`).then(response => {
    // you need the timezone to format time of day.
    console.log(response.data);
    // loop through objects
    const dataToSend = response.data.data.map(data => new WeatherForecast(data, response.data.timezone));
    //console.log(dataToSend);
    res.status(200).send(dataToSend);

    //res.status(200).send(response.data);
  }).catch(error => {
    res.status(500).send(error);
    console.error(error);
  });

});

// 404 not found path.
app.get('*', (request, response) => {
  response.status(404).send('The route was not found. Error 404');
});

/* Movie Routes */


/* Food Routes */



/*** ROUTE END ***/




/* Classes */
class Forecast {
  constructor (cityObject) {
    this.description = cityObject.weather.description;
    this.date = cityObject.valid_date;
  }
}

class WeatherForecast {
  constructor (weatherObject) {
    this.time = new Date(weatherObject.timestamp_utc).toLocaleString('en-US', { hour: "numeric" });
    this.icon = weatherObject.weather.icon;
    this.desc = weatherObject.weather.description;
    this.temp = `${weatherObject.temp} \u2109`;
    this.direction = weatherObject.wind_cdir;
    this.speed = weatherObject.wind_spd;
    this.gust = weatherObject.wind_gust_spd;
    this.precip = weatherObject.precip;

  }
}

/* Errors */
// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});


