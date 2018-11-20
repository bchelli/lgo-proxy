'use strict';

const { errorLogger } = require('express-winston');

function createErrorLoggerMiddleware(dependencies) {
  const { logger } = dependencies;

  return errorLogger({
    winstonInstance: logger,
    msg: '{{req.method}} {{req.url}} {{err.message}}',
    exceptionToMeta: () => ({}),
    baseMeta: { req: {} }
  });
}

module.exports = { createErrorLoggerMiddleware };
