'use strict';

function createAuthenticationProxyMiddleware(dependencies) {
  const { headersFactory, logger } = dependencies;

  return proxyRequest => {
    logger.debug('Adding authentication to headers');
    const headers = headersFactory(proxyRequest.context.targetUrl);
    Object.entries(headers).forEach(([key, value]) =>
      proxyRequest.setHeader(key, value)
    );
  };
}

module.exports = { createAuthenticationProxyMiddleware };
