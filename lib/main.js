'use strict';

const { Server } = require('./web');
const { logFactory, patchConsole } = require('./tools');
const { loadConfiguration } = require('./configuration');
const { bootstrap } = require('./bootstrap');

const configuration = loadConfiguration();
const { defaultLogger } = logFactory({ configuration });

patchConsole(defaultLogger);

const dependencies = bootstrap({
  configuration,
  defaultLogger
});

const server = new Server(dependencies);

server
  .start()
  .catch(error => defaultLogger.error('Impossible to start server', error));
