'use strict';

const OrderStatus = {
  sent: 'SENT',
  received: 'RECEIVED',
  pending: 'PENDING',
  open: 'OPEN',
  done: 'DONE',
  cancelled: 'CANCEL',
  invalid: 'INVALID',
  ptsCheckFailure: 'PTS_CHECK_FAILURE'
};

module.exports = { OrderStatus };
