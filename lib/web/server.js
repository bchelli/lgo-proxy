'use strict';

const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');

class Server {
  constructor(dependencies) {
    const {
      configuration,
      logger,
      requestLoggerMiddleware,
      requestContextMiddleware,
      notFoundMiddleware,
      errorLoggerMiddleware,
      errorMiddleware,
      router,
      downloadKeysPeriodically,
      proxifyServerWebSocket
    } = dependencies;
    this.configuration = configuration;
    this.logger = logger;
    this.downloadKeysPeriodically = downloadKeysPeriodically;
    const app = express();
    app.use(requestLoggerMiddleware);
    app.use(requestContextMiddleware);
    app.use(bodyParser.json());
    app.use(router);
    app.use(notFoundMiddleware);
    app.use(errorLoggerMiddleware);
    app.use(errorMiddleware);
    this.server = createServer(app);
    proxifyServerWebSocket(this.server);
  }

  async start() {
    const self = this;
    await startServer();
    this.downloadKeysPeriodically();
    this.logger.info('Server started on port %s', this.configuration.port);

    function startServer() {
      return new Promise((resolve, reject) => {
        self.server.listen(self.configuration.port);
        self.server.on('error', error => {
          self.logger.error('Server error', error);
          reject(error);
        });
        self.server.on('listening', () => {
          resolve();
        });
      });
    }
  }
}

module.exports = { Server };
