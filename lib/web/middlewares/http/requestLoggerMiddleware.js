'use strict';

const { logger: requestLogger } = require('express-winston');

function createRequestLoggerMiddleware(dependencies) {
  const { logger, options = {} } = dependencies;

  const ignoredRoutes = options.ignoredRoutes || [];
  return requestLogger({
    winstonInstance: logger,
    expressFormat: true,
    meta: false,
    ignoreRoute: request => ignoredRoutes.indexOf(request.url) !== -1
  });
}

module.exports = { createRequestLoggerMiddleware };
