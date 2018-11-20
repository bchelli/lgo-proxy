'use strict';

const util = require('util');
const { createLogger, format, transports } = require('winston');

function logFactory(creation) {
  const { configuration } = creation;

  const defaultLogger = logger({
    level: configuration.log.level,
    colorize: configuration.log.colorize,
    json: configuration.log.json
  });

  return {
    defaultLogger
  };
}

const consolidateError = format(info => {
  if (
    info.message &&
    info.message.error &&
    info.message.error instanceof Error
  ) {
    info.message = messageFromError(info.message.error);
    return info;
  }
  if (info.meta && info.meta instanceof Error) {
    info.message = `${info.message}\n${messageFromError(info.meta)}`;
    return info;
  }
  return info;
});

function messageFromError(error) {
  return error.stack ? error.stack : error.message;
}

const inspectObject = format(info => {
  if (typeof info.message !== 'string') {
    info.message = util.inspect(info.message);
  }
  return info;
});

const formatMessage = format.printf(
  info => `${info.timestamp} - ${info.level}: ${info.message}`
);

function logger(options) {
  const safeOptions = withDefaults(options);
  const format = createFormat(safeOptions);

  return createLogger({
    transports: [
      new transports.Console({
        format,
        level: safeOptions.level
      })
    ]
  });
}

function withDefaults(options) {
  return Object.assign(
    {
      level: 'info',
      colorize: false,
      json: false
    },
    options
  );
}

function createFormat(options) {
  const formats = [
    format.timestamp(),
    format.splat(),
    inspectObject(),
    consolidateError()
  ];
  if (options.colorize) {
    formats.push(format.colorize());
  }
  if (options.json) {
    formats.push(format.json());
  } else {
    formats.push(formatMessage);
  }
  return format.combine(...formats);
}

function patchConsole(logger) {
  /* eslint-disable no-console */
  console.log = (...args) => logger.info(...args);
  console.info = (...args) => logger.info(...args);
  console.error = (...args) => logger.error(...args);
  console.debug = (...args) => logger.debug(...args);
  console.warn = (...args) => logger.warn(...args);
  /* eslint-enable no-console */
}

module.exports = { logFactory, patchConsole };
