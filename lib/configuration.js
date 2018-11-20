'use strict';

const { loadConfiguration: load } = require('@arpinum/config');

function loadConfiguration() {
  return load({
    port: {
      env: 'LGO_PORT',
      type: 'integer',
      default: 3002
    },
    accessKey: {
      env: 'LGO_ACCESS_KEY',
      required: true
    },
    log: {
      level: {
        env: 'LGO_LOG_LEVEL',
        default: 'debug'
      },
      json: {
        env: 'LGO_LOG_JSON',
        type: 'boolean',
        default: false
      },
      colorize: {
        env: 'LGO_LOG_COLORIZE',
        type: 'boolean',
        default: true
      }
    },
    verboseErrors: {
      env: 'LGO_VERBOSE_ERRORS',
      type: 'boolean',
      default: true
    },
    exchangeUrl: {
      env: 'LGO_EXCHANGE_URL',
      default: 'http://localhost:8081'
    },
    webSocketUrl: {
      env: 'LGO_WS_URL',
      default: 'ws://localhost:8084'
    },
    keys: {
      url: {
        env: 'LGO_KEYS_URL',
        default: 'http://localhost:3001/keys'
      },
      downloadPattern: {
        env: 'LGO_KEY_DOWNLOAD_PATTERN',
        default: '0 * * * * *' // every minutes
      },
      downloadConcurrency: {
        env: 'LGO_KEY_DOWNLOAD_CONCURRENCY',
        type: 'integer',
        default: 3
      }
    },
    signer: {
      libraryPath: {
        env: 'LGO_SIGNER_LIBRARY_PATH',
        default: '/usr/local/Cellar/softhsm/2.5.0/lib/softhsm/libsofthsm2.so'
      },
      pin: {
        env: 'LGO_SIGNER_PIN',
        default: '0000'
      }
    }
  });
}

module.exports = { loadConfiguration };
