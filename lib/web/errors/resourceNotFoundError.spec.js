'use strict';

const { ResourceNotFoundError } = require('./resourceNotFoundError');

describe('Resource not found error', () => {
  it('should contain default message', () => {
    const error = new ResourceNotFoundError();

    expect(error.message).toEqual('Resource not found');
  });

  it('should contain a custom message', () => {
    const error = new ResourceNotFoundError('bleh');

    expect(error.message).toEqual('bleh');
  });

  it('should be a typed Error', () => {
    const error = new ResourceNotFoundError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ResourceNotFoundError);
    expect(error.constructor.name).toEqual('ResourceNotFoundError');
  });
});
