'use strict';

const axios = require('axios');
const cache = require('./cache');
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const timeToCache = 1000 * 60 * 60; // 1 hour

const getWeatherData = (req, res) => {

  // for axios
  const { lat, lon } = req.query;

  // for cache
  const key = `weather-${lat}-${lon}-data`;

  if (cache[key] && (Date.now() - cache[key].timeStamp) < timeToCache) {
    res.status(200).send(cache[key]);
  } else {
    // delete old cache
    delete cache[key];
    // default return next 48 hours
    axios.get(`https://api.weatherbit.io/v2.0/forecast/hourly?lat=${lat}&lon=${lon}&units=I&key=${WEATHER_API_KEY}`).then(response => {
      // loop through objects
      const dataToSend = response.data.data.map(data => new WeatherForecast(data));

      //add to cache
      cache[key] = {
        data: dataToSend,
        timeStamp: Date.now()
      };

      res.send(cache[key]);
    }).catch(error => {
      console.error(error);
      res.status(500).send(error);
    });
  }
};

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

module.exports = getWeatherData;
