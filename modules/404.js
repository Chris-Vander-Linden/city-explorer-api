const unknownPageResponse = ('*', (request, response) => {
  response.status(404).send('The route was not found. Error 404');
});

module.exports = unknownPageResponse;
