'use strict';

function waitALittle() {
  return wait(100);
}

function wait(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

module.exports = {
  waitALittle,
  wait,
  ...require('./examples'),
  ...require('./mockHttp'),
  ...require('./mockRequest'),
  ...require('./mockResponse'),
  ...require('./mockSigner'),
  ...require('./silentLogger')
};
