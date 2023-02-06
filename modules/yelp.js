'use strict';

// axios for external API
const axios = require('axios');

const YELP_API_KEY = process.env.YELP_API_KEY;

/* Movie Routes */
const getYelpData = (req, res) => {
  const { lat, lon } = req.query;
  console.log(lat, lon);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: YELP_API_KEY
    }
  };

  axios.get(`https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}&sort_by=best_match&limit=50`, options).then(data => {
    console.log(data.data.businesses);

    const dataToSend = data.data.businesses.map(business => {
      return new Yelp(business);
    });

    res.status(200).send(dataToSend);
  }).catch(err => {
    console.error(err);
    res.status(500).send(err);
  });
};



class Yelp {
  constructor (arrayObject) {
    this.name = arrayObject.name;
    this.image_url = arrayObject.image_url;
    this.price = arrayObject.price;
    this.rating = arrayObject.rating;
    this.url = arrayObject.url;
    this.phone = arrayObject.display_phone;
    this.address = arrayObject.location.display_address;
    this.distance = arrayObject.distance;
    this.categories = arrayObject.categories;
    this.open = !arrayObject.is_closed;
    this.transactions = arrayObject.transactions;
  }
}

module.exports = getYelpData;
