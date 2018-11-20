'use strict';

const { createProxyServer } = require('http-proxy');

function createExchangeProxy(dependencies) {
  const {
    configuration,
    authenticationProxyMiddleware,
    bodyProxyMiddleware,
    errorProxyMiddleware,
    requestContextProxyMiddleware
  } = dependencies;

  const proxy = createProxyServer({
    target: configuration.exchangeUrl,
    changeOrigin: true
  });
  proxy.on('error', errorProxyMiddleware);
  proxy.on('proxyReq', requestContextProxyMiddleware);
  proxy.on('proxyReq', authenticationProxyMiddleware);
  proxy.on('proxyReq', bodyProxyMiddleware);

  return proxy;
}

module.exports = { createExchangeProxy };
