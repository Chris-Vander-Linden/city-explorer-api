'use strict';

// axios for external API
const axios = require('axios');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const getWeatherData = (req, res) => {
  const { lat, lon } = req.query;
  // default return next 48 hours
  axios.get(`https://api.weatherbit.io/v2.0/forecast/hourly?lat=${lat}&lon=${lon}&units=I&key=${WEATHER_API_KEY}`).then(response => {
    // loop through objects
    const dataToSend = response.data.data.map(data => new WeatherForecast(data, response.data.timezone));
    //console.log(dataToSend);
    // This sends the data as JSON?
    res.send(dataToSend);
  }).catch(error => {
    console.error(error);
    res.status(500).send(error);
  });
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
