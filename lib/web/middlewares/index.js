'use strict';

module.exports = {
  ...require('./httpProxy'),
  ...require('./http'),
  ...require('./ws')
};
