'use strict';

const { ClientError, ResourceNotFoundError } = require('../../errors');
const { ValidationError } = require('../../../tools');

function createErrorMiddleware(dependencies) {
  const { configuration } = dependencies;

  /* eslint-disable-next-line no-unused-vars */
  return (error, request, response, next) => {
    const statusCode = statusCodeFromError(error);
    response.status(statusCode);
    const body = {
      message: error.message
    };
    if (error.code !== undefined) {
      body.code = error.code;
    }
    if (configuration.verboseErrors) {
      body.error = error;
    }
    response.send(body);
  };

  function statusCodeFromError(error) {
    if (error instanceof ResourceNotFoundError) {
      return 404;
    }
    if (error instanceof ValidationError || error instanceof ClientError) {
      return 400;
    }
    return 500;
  }
}

module.exports = { createErrorMiddleware };
