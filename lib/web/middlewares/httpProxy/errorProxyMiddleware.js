'use strict';

function createErrorProxyMiddleware(dependencies) {
  const { logger } = dependencies;
  return (error, request, response) => {
    logger.error('Error in http proxy', error);
    response.sendStatus(500);
  };
}

module.exports = { createErrorProxyMiddleware };
