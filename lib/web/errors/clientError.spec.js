'use strict';

const { ClientError } = require('./clientError');

describe('Client error', () => {
  it('should contain default message', () => {
    const error = new ClientError();

    expect(error.message).toEqual('Client error');
  });

  it('should contain a custom message', () => {
    const error = new ClientError('bleh');

    expect(error.message).toEqual('bleh');
  });

  it('should be a typed Error', () => {
    const error = new ClientError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ClientError);
    expect(error.constructor.name).toEqual('ClientError');
  });
});
