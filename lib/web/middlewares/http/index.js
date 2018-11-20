'use strict';

module.exports = {
  ...require('./errorLoggerMiddleware'),
  ...require('./errorMiddleware'),
  ...require('./notFoundMiddleware'),
  ...require('./requestContextMiddleware'),
  ...require('./requestLoggerMiddleware')
};
