'use strict';

const { MockResponse, SilentLogger } = require('../../../test');
const { createErrorProxyMiddleware } = require('./errorProxyMiddleware');

describe('Error proxy middleware', () => {
  let middleware;

  beforeEach(() => {
    middleware = createErrorProxyMiddleware({
      logger: new SilentLogger()
    });
  });

  it('should send a 500', () => {
    const response = new MockResponse();

    middleware(new Error('bleh'), {}, response);

    expect(response.sendStatus).toHaveBeenCalledWith(500);
  });
});
