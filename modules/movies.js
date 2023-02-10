'use strict';

// axios for external API
const axios = require('axios');
const cache = require('./cache');
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

const timeToCache = 1000 * 60 * 60 * 24 * 30; // 30 days

/* Movie Routes */
const getMovieData = (req, res) => {

  // for axios
  const cityName = req.query.cityName;

  // for cache
  const key = `movies-${cityName}-data`;

  if (cache[key] && (Date.now() - cache[key].timeStamp) < timeToCache) {
    res.status(200).send(cache[key]);
  } else {
    // Get image base path, so I can later form full path
    axios.get(`https://api.themoviedb.org/3/configuration?api_key=${MOVIE_API_KEY}`).then(response => {
      const basePathData = { thumb_img_url: response.data.images.base_url + response.data.images.poster_sizes[0], large_img_url: response.data.images.base_url + response.data.images.poster_sizes[response.data.images.poster_sizes.length - 1] };

      // Get movie data
      axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${cityName}`).then(response => {
        const dataToSend = response.data.results.map(movie => new Movie(movie, basePathData));

        //add to cache
        cache[key] = {
          data: dataToSend,
          timeStamp: Date.now()
        };

        res.send(cache[key]);

      }).catch(error => {
        res.status(500).send(error);
        console.error(error);
      });
    }).catch(error => {
      res.status(500).send(error);
      console.error(error);
    });
  };
};

class Movie {
  constructor (arrayObject, basePathDataObj) {
    this.id = arrayObject.id;
    this.title = arrayObject.title;
    this.cover = basePathDataObj.thumb_img_url + arrayObject.poster_path;
    this.cover_large = basePathDataObj.large_img_url + arrayObject.poster_path;
    this.overview = arrayObject.overview;
    this.vote = ((Number.parseInt(arrayObject.vote_average) / 10) * 100);
    this.release = arrayObject?.release_date || '-';;
  }
}

module.exports = getMovieData;
