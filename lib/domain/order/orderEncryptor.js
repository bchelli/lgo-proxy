'use strict';

class OrderEncryptor {
  constructor(dependencies) {
    const { cryptoService } = dependencies;
    this.cryptoService = cryptoService;
  }

  encryptOrder(key, order) {
    const serializedOrder = serializeOrder(order);
    const encryptedOrder = this.cryptoService.encrypt(
      key.publicKey,
      Buffer.from(serializedOrder)
    );
    return encryptedOrder.toString('base64');

    function serializeOrder(order) {
      const parts = [
        order.type,
        order.side,
        order.productId,
        order.quantity,
        order.price
      ];
      return parts.join(',');
    }
  }

  encryptCancelOrder(key, orderId) {
    const serializedCancelOrder = serializeCancel(orderId);
    const encryptedCancelOrder = this.cryptoService.encrypt(
      key.publicKey,
      Buffer.from(serializedCancelOrder)
    );
    return encryptedCancelOrder.toString('base64');

    function serializeCancel(orderId) {
      const parts = ['C', orderId];
      return parts.join(',');
    }
  }
}

module.exports = { OrderEncryptor };
