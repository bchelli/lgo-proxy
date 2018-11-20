'use strict';

const { examples, MockSigner } = require('../test');
const { createHeadersFactory } = require('./headersFactory');

describe('Headers factory', () => {
  let factory;
  let createDate;
  let signer;

  beforeEach(() => {
    const configuration = { accessKey: '12a' };
    createDate = jest.fn().mockReturnValue(examples.june);
    signer = new MockSigner();
    factory = createHeadersFactory({ configuration, createDate, signer });
  });

  beforeEach(() => {
    signer.sign = jest.fn().mockImplementation(message => `${message}_signed`);
  });

  it('should add a custom header with timestamp', () => {
    const headers = factory('http://server/path');

    expect(headers['X-LGO-DATE']).toEqual(examples.june.getTime());
  });

  it('should add an authorization header with a signature', () => {
    const headers = factory('http://server/path');
    const timestamp = examples.june.getTime();

    expect(headers['Authorization']).toEqual(
      `LGO 12a:${timestamp}\nserver/path_signed`
    );
  });
});
