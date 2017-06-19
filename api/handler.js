'use strict'; // eslint-disable-line strict

const handle = require('./graphql/index').default; // eslint-disable-line import/no-unresolved
const createResponse = (statusCode, body) => (
  {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS
    },
    body: JSON.stringify(body),
  }
);

module.exports.hello = function(event, context, callback) {
  callback(null, createResponse(200, { message: 'Hello World', event }));
};

module.exports.graphql = (event, context, callback) => {
  // Is thre a way to parse json dirrecrly
  const body = JSON.parse(event.body);
  handle(body.query, body.variables)
    .then((response) => callback(null, createResponse(200, response)))
    .catch((error) => callback(null, createResponse(error.responseStatusCode || 500, { message: error.message || 'Internal server error' })));
};
