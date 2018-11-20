'use strict';

function createErrorWsMiddleware(dependencies) {
  const { logger } = dependencies;
  return error => {
    logger.error('Error in WebSocket proxy', error);
  };
}

module.exports = { createErrorWsMiddleware };
