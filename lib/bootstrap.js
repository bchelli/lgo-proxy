'use strict';

const { createDate, CryptoService, Http, Signer } = require('./tools');
const {
  createDownloadKeys,
  createDownloadKeysPeriodically,
  KeyRepository,
  OrderEncryptor
} = require('./domain');
const {
  createExchangeProxy,
  createWebSocketProxy,
  createPublicKeyGet,
  createStatusGet,
  createPrepareCancelPost,
  createPrepareOrderPost,
  createOrdersPost,
  createDeleteOrderPost,
  createRouter,
  createRequestContextMiddleware,
  createErrorProxyMiddleware,
  createErrorWsMiddleware,
  createBodyProxyMiddleware,
  createErrorLoggerMiddleware,
  createAuthenticationProxyMiddleware,
  createNotFoundMiddleware,
  createErrorMiddleware,
  createRequestContextProxyMiddleware,
  createRequestLoggerMiddleware,
  createHeadersFactory
} = require('./web');

function bootstrap(dependencies) {
  const { configuration, defaultLogger } = dependencies;
  const logger = defaultLogger;

  const http = new Http();
  const signer = new Signer({
    libraryPath: configuration.signer.libraryPath,
    pin: configuration.signer.pin,
    logger
  });

  const keyRepository = new KeyRepository({ createDate, logger });
  const downloadKeys = createDownloadKeys({
    configuration,
    createDate,
    logger,
    http,
    keyRepository
  });
  const downloadKeysPeriodically = createDownloadKeysPeriodically({
    downloadKeys,
    logger,
    configuration
  });

  const cryptoService = new CryptoService();
  const orderEncryptor = new OrderEncryptor({ cryptoService });

  const headersFactory = createHeadersFactory({
    configuration,
    createDate,
    signer
  });

  const errorProxyMiddleware = createErrorProxyMiddleware({ logger });
  const errorWsMiddleware = createErrorWsMiddleware({ logger });
  const authenticationProxyMiddleware = createAuthenticationProxyMiddleware({
    headersFactory,
    logger
  });
  const bodyProxyMiddleware = createBodyProxyMiddleware({
    logger
  });
  const errorLoggerMiddleware = createErrorLoggerMiddleware({
    logger
  });
  const requestContextMiddleware = createRequestContextMiddleware();
  const requestContextProxyMiddleware = createRequestContextProxyMiddleware({
    logger
  });
  const requestLoggerMiddleware = createRequestLoggerMiddleware({
    logger,
    options: {
      ignoredRoutes: ['/healthz']
    }
  });
  const notFoundMiddleware = createNotFoundMiddleware();
  const errorMiddleware = createErrorMiddleware({ configuration });

  const exchangeProxy = createExchangeProxy({
    configuration,
    authenticationProxyMiddleware,
    bodyProxyMiddleware,
    errorProxyMiddleware,
    requestContextProxyMiddleware
  });

  const { proxifyServer: proxifyServerWebSocket } = createWebSocketProxy({
    configuration,
    errorWsMiddleware,
    headersFactory
  });

  const publicKeyGet = createPublicKeyGet({ signer });

  const statusGet = createStatusGet();

  const deleteOrderPost = createDeleteOrderPost({
    logger,
    exchangeProxy,
    keyRepository,
    orderEncryptor,
    signer
  });

  const prepareCancelPost = createPrepareCancelPost({
    logger,
    keyRepository,
    orderEncryptor,
    signer
  });

  const prepareOrderPost = createPrepareOrderPost({
    logger,
    keyRepository,
    orderEncryptor,
    signer
  });

  const ordersPost = createOrdersPost({
    logger,
    exchangeProxy,
    keyRepository,
    orderEncryptor,
    signer
  });

  const router = createRouter({
    exchangeProxy,
    publicKeyGet,
    deleteOrderPost,
    statusGet,
    prepareCancelPost,
    prepareOrderPost,
    ordersPost
  });

  return {
    logger,
    configuration,
    requestContextMiddleware,
    requestLoggerMiddleware,
    notFoundMiddleware,
    errorLoggerMiddleware,
    errorMiddleware,
    router,
    downloadKeysPeriodically,
    proxifyServerWebSocket,
    headersFactory
  };
}

module.exports = { bootstrap };
