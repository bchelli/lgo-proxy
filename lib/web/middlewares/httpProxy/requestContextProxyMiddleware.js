'use strict';

function createRequestContextProxyMiddleware(dependencies) {
  const { logger } = dependencies;

  return (proxyRequest, request, response, options) => {
    const rawProtocol = options.target.protocol;
    const protocol = rawProtocol.replace(':', '');
    const host = options.target.host;
    const rawPath = proxyRequest.path;
    const path = rawPath.startsWith('/') ? rawPath.replace('/', '') : rawPath;
    const targetUrl = `${protocol}://${host}/${path}`;
    logger.debug(
      `Proxying ${request.context.method} ${request.context.url} to ${
        request.method
      } ${targetUrl}`
    );
    proxyRequest.context = { targetUrl };
  };
}

module.exports = { createRequestContextProxyMiddleware };
