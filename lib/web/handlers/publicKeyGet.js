'use strict';

const { ClientError } = require('../errors');

function createPublicKeyGet(dependencies) {
  const { signer } = dependencies;
  return (_, response) => {
    if (!signer.isHsmInitialized()) {
      throw new ClientError('Proxy not initialised');
    }
    response.send(signer.getRSAPublicKey());
  };
}

module.exports = { createPublicKeyGet };
