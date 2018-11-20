'use strict';

const { createProxyServer } = require('http-proxy');

function createWebSocketProxy(dependencies) {
  const { configuration, errorWsMiddleware, headersFactory } = dependencies;

  const proxy = createProxyServer({
    target: configuration.webSocketUrl,
    changeOrigin: true,
    ws: true
  });
  proxy.on('error', errorWsMiddleware);

  return { proxy, proxifyServer };

  function proxifyServer(server) {
    const targetUrl = `${configuration.webSocketUrl}/`;
    server.on('upgrade', (request, socket, head) => {
      request.headers = Object.assign(
        {},
        request.headers,
        headersFactory(targetUrl)
      );
      return proxy.ws(request, socket, head);
    });
  }
}

module.exports = { createWebSocketProxy };
