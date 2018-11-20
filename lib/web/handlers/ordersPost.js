'use strict';

const { OrderType, OrderSide } = require('../../domain');
const { createValidation } = require('../../tools');

const bodySchema = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: Object.values(OrderType) },
    side: { type: 'string', enum: Object.values(OrderSide) },
    product_id: { type: 'string' },
    quantity: { type: 'string' },
    price: { type: 'string' }
  },
  required: ['type', 'side', 'product_id', 'quantity'],
  additionalProperties: false
};

const validateBody = createValidation(bodySchema);

function createOrdersPost(dependencies) {
  const {
    logger,
    exchangeProxy,
    keyRepository,
    orderEncryptor,
    signer
  } = dependencies;
  return (request, response) => {
    validateBody(request.body);
    const order = orderFromBody(request.body);
    const key = getKeyToUse();
    logger.debug('Using key %s to encrypt order', key.id);
    const encryptedOrder = orderEncryptor.encryptOrder(key, order);
    const signature = signer.sign(encryptedOrder);
    request.body = { key_id: key.id, order: encryptedOrder, signature };
    return exchangeProxy.web(request, response);
  };

  function orderFromBody(body) {
    const { type, side, product_id, quantity, price } = body;
    return { type, side, productId: product_id, quantity, price };
  }

  function getKeyToUse() {
    const key = keyRepository.getCurrent();
    if (!key) {
      throw new Error('No encryption key found');
    }
    logger.debug('Using key %s to encrypt order', key.id);
    return key;
  }
}

module.exports = { createOrdersPost };
