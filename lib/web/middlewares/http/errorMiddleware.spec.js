'use strict';

const { MockResponse } = require('../../../test');
const { ClientError, ResourceNotFoundError } = require('../../errors');
const { createErrorMiddleware } = require('./errorMiddleware');

describe('Error middleware', () => {
  let middleware;
  let request;
  let response;
  let next;
  let configuration;

  beforeEach(() => {
    request = {};
    response = new MockResponse();
    next = () => {};
    configuration = {};
    middleware = createErrorMiddleware({ configuration });
  });

  it('should send 500 by default', () => {
    const error = new Error('bleh');

    middleware(error, request, response, next);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith({
      message: 'bleh'
    });
  });

  it('should send full error if configured so', () => {
    configuration.verboseErrors = true;
    const error = new Error('Error');

    middleware(error, request, response, next);

    expect(response.send).toHaveBeenCalledWith({
      message: 'Error',
      error
    });
  });

  it('should send 404 for ResourceNotFoundError', () => {
    const error = new ResourceNotFoundError();

    middleware(error, request, response, next);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.send).toHaveBeenCalledWith({
      message: 'Resource not found'
    });
  });

  it('should send 400 for ClientError', () => {
    const error = new ClientError('bleh');

    middleware(error, request, response, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith({
      message: 'bleh'
    });
  });
});
