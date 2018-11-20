'use strict';

function createBodyProxyMiddleware(dependencies) {
  const { logger } = dependencies;

  return (proxyRequest, request) => {
    if (request.body && request.complete) {
      logger.debug('Writing body in proxied request');
      const bodyData = JSON.stringify(request.body);
      proxyRequest.setHeader('Content-Type', 'application/json');
      proxyRequest.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyRequest.write(bodyData);
    }
  };
}

module.exports = { createBodyProxyMiddleware };
