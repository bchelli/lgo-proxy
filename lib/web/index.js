'use strict';

module.exports = {
  ...require('./handlers'),
  ...require('./middlewares'),
  ...require('./proxies'),
  ...require('./headersFactory'),
  ...require('./router'),
  ...require('./server')
};
