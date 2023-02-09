'use strict';

// axios for external API
const axios = require('axios');

const YELP_API_KEY = process.env.YELP_API_KEY;

/* Movie Routes */
const getYelpData = (req, res) => {
  const { lat, lon } = req.query;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: YELP_API_KEY
    }
  };

  axios.get(`https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}&sort_by=distance&limit=10`, options).then(data => {
    const dataToSend = data.data.businesses.map(business => (
      new Yelp(business)
    ));
    res.status(200).send(dataToSend);
  }).catch(err => {
    console.error(err);
    res.status(500).send(err);
  });
};

class Yelp {
  constructor (arrayObject) {
    this.name = arrayObject.name;
    this.image = arrayObject.image_url;
    this.price = arrayObject?.price || '-';
    this.rating = arrayObject.rating + '/5';
    this.url = arrayObject.url;
    this.phone = arrayObject.display_phone;
    this.address = arrayObject.location.display_address.join('. ');
    this.distance = `${(arrayObject.distance / 1600).toFixed(2)} ${arrayObject.distance / 1600 >= 2 ? 'miles' : 'mile'} `;
    //this.categories = arrayObject.categories;
    this.hours = !arrayObject.is_closed ? 'open' : 'closed';
    this.type = arrayObject.transactions.join(', ');
  }
}

module.exports = getYelpData;
