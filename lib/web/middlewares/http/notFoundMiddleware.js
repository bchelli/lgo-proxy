'use strict';

const { ResourceNotFoundError } = require('../../errors');

function createNotFoundMiddleware() {
  return (request, response, next) => {
    next(new ResourceNotFoundError());
  };
}

module.exports = { createNotFoundMiddleware };
