'use strict';

function createRequestContextMiddleware() {
  return (request, response, next) => {
    request.context = {
      url: request.url,
      method: request.method
    };
    next();
  };
}

module.exports = { createRequestContextMiddleware };
