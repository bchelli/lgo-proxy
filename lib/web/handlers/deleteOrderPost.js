'use strict';

const { createValidation } = require('../../tools');

const paramsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' }
  },
  required: ['id'],
  additionalProperties: false
};

const validateParams = createValidation(paramsSchema);

function createDeleteOrderPost(dependencies) {
  const {
    logger,
    exchangeProxy,
    keyRepository,
    orderEncryptor,
    signer
  } = dependencies;
  return (request, response) => {
    validateParams(request.params);
    const { id } = request.params;
    const key = getKeyToUse();
    logger.debug('Using key %s to encrypt order cancellation', key.id);
    const encryptedOrder = orderEncryptor.encryptCancelOrder(key, id);
    const signature = signer.sign(encryptedOrder);
    request.body = { key_id: key.id, order: encryptedOrder, signature };
    request.method = 'POST';
    request.url = '/orders';
    return exchangeProxy.web(request, response);
  };

  function getKeyToUse() {
    const key = keyRepository.getCurrent();
    if (!key) {
      throw new Error('No encryption key found');
    }
    logger.debug('Using key %s to encrypt order cancellation', key.id);
    return key;
  }
}

module.exports = { createDeleteOrderPost };
