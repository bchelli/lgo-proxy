'use strict';

class ClientError extends Error {
  constructor(message) {
    super(message || 'Client error');
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

module.exports = { ClientError };
