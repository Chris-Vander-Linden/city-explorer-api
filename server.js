'use strict';

// set hidden global vars from .env file
require('dotenv').config();
const PORT = process.env.PORT || 5005;

// create express app
const express = require('express');
const app = express();

// pass cors into express app, listen on port
const cors = require('cors');
app.use(cors());
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

// import practice data
let data = require('./data/weather.json');

/* Routes */

// app instance get method takes path and callback function.
app.get('/', (request, response) => {
  //http://localhost:3003/

  //then we need to send something back
  response.send('Hello from our server HOME route / !!!');
});

app.get('/weather', (request, response) => {
  //http://localhost:3003/weather?searchQuery=Seattle

  try {
    // query from request
    let {searchQuery} = request.query;

    // find matching city
    let dataToInstantiate = data.find(city => {
      return city.city_name === searchQuery;
    });

    // loop through objects
    let dataToSend = dataToInstantiate.data.map(data => new Forcast(data));

    response.status(200).send(dataToSend);

  } catch (error) {
    //create a new instance of error
    //this will instantiate any new error
    // eslint-disable-next-line no-undef
    next(error);
  }
});

// 404 not found path.
app.get('*', (request, response) => {
  response.status(404).send('The route was not found. Error 404');
});

/* Class */
class Forcast {
  constructor (cityObject) {
    this.description = cityObject.weather.description;
    this.date = cityObject.valid_date;
  }
}

/* Errors */
// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});
