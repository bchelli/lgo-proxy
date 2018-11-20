'use strict';

module.exports = {
  ...require('./deleteOrderPost'),
  ...require('./prepareCancelPost'),
  ...require('./prepareOrderPost'),
  ...require('./ordersPost'),
  ...require('./publicKeyGet'),
  ...require('./statusGet')
};
