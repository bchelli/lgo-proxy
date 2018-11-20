'use strict';

const { Router } = require('express');

function createRouter(dependencies) {
  const {
    exchangeProxy,
    deleteOrderPost,
    prepareOrderPost,
    prepareCancelPost,
    ordersPost,
    publicKeyGet,
    statusGet
  } = dependencies;

  const routing = Router();
  routing.get('/publicKey', publicKeyGet);
  routing.get('/status', statusGet);
  routing.get('/currencies', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/products/:id/book', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/products/:id/trades', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/products', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.post('/prepare-order', prepareOrderPost);
  routing.post('/prepare-cancel', prepareCancelPost);
  routing.delete('/orders/:id', deleteOrderPost);
  routing.post('/orders', ordersPost);
  routing.get('/orders', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/trades', (request, response) =>
    exchangeProxy.web(request, response)
  );
  routing.get('/trading-accounts', (request, response) =>
    exchangeProxy.web(request, response)
  );
  return routing;
}

module.exports = { createRouter };
