const cache = {};

const clearOldCache = () => {
  console.log('searching for old cache to delete');
  // loop through cache to remove old un searched objects
  for (const key in cache) {

    if (Date.now() - cache[key].timeStamp > maxTimeToCache) {
      delete cache[key];
    }
    console.log(cache[key]?.timeStamp ?? `deleted`);
  }
};

// delete cache that has been around for an hour.
const maxTimeToCache = 1000 * 60 * 60;

// needs a timer to run
setInterval(clearOldCache, maxTimeToCache);

module.exports = cache;
