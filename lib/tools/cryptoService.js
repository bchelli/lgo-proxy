'use strict';

const { RSA_PKCS1_OAEP_PADDING } = require('constants');
const { publicEncrypt } = require('crypto');

class CryptoService {
  encrypt(key, buffer) {
    const keyObject = {
      key,
      padding: RSA_PKCS1_OAEP_PADDING
    };
    return publicEncrypt(keyObject, buffer);
  }
}

module.exports = { CryptoService };
