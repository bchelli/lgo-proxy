'use strict';

const { createValidation } = require('../../tools');

const bodySchema = {
  type: 'object',
  properties: {
    order_id: { type: 'string' }
  },
  required: ['order_id'],
  additionalProperties: false
};

const validateBody = createValidation(bodySchema);

function createPrepareCancelPost(dependencies) {
  const { logger, keyRepository, orderEncryptor, signer } = dependencies;
  return (request, response) => {
    validateBody(request.body);
    const cancellation = cancellationFromBody(request.body);
    const key = getKeyToUse();
    logger.debug('Using key %s to encrypt order cancellation', key.id);
    const encryptedOrder = orderEncryptor.encryptCancelOrder(
      key,
      cancellation.orderId
    );
    const signature = signer.sign(encryptedOrder);
    response.send({ key_id: key.id, order: encryptedOrder, signature });
  };

  function cancellationFromBody(body) {
    const { order_id } = body;
    return { orderId: order_id };
  }

  function getKeyToUse() {
    const key = keyRepository.getCurrent();
    if (!key) {
      throw new Error('No encryption key found');
    }
    logger.debug('Using key %s to encrypt order cancellation', key.id);
    return key;
  }
}

module.exports = { createPrepareCancelPost };
