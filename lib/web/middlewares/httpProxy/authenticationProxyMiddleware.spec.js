'use strict';

const { MockRequest, SilentLogger } = require('../../../test');
const {
  createAuthenticationProxyMiddleware
} = require('./authenticationProxyMiddleware');

describe('Authentication proxy middleware', () => {
  let middleware;
  let headersFactory;

  beforeEach(() => {
    headersFactory = jest.fn().mockReturnValue(undefined);
    middleware = createAuthenticationProxyMiddleware({
      headersFactory,
      logger: new SilentLogger()
    });
  });

  it('should set each header', () => {
    const proxyRequest = new MockRequest();
    proxyRequest.context = { targetUrl: 'http://server' };
    headersFactory.mockImplementation(url =>
      url === 'http://server' ? { header1: 'value1', header2: 'value2' } : null
    );

    middleware(proxyRequest, {}, {}, {});

    expect(proxyRequest.setHeader).toHaveBeenCalledWith('header1', 'value1');
    expect(proxyRequest.setHeader).toHaveBeenCalledWith('header2', 'value2');
  });
});
