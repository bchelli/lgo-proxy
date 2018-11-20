'use strict';

const Ajv = require('ajv');

class ValidationError extends Error {
  constructor(errors) {
    super('Validation failed');
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.payload = { errors };
  }
}

function createValidation(schema) {
  const validator = new Ajv({ allErrors: true }).compile(schema);
  return object => {
    if (!validator(object)) {
      throw new ValidationError(validator.errors || []);
    }
  };
}

module.exports = { ValidationError, createValidation };
