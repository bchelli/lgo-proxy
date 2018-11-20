'use strict';

class ResourceNotFoundError extends Error {
  constructor(message) {
    super(message || 'Resource not found');
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

module.exports = { ResourceNotFoundError };
