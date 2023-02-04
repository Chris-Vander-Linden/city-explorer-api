const homeResponse = ('*', (request, response) => {
  response.status(200).send('This is the home page.  Good job!');
});

module.exports = homeResponse;
