'use strict';

const graphene = require('graphene-pk11');
const NodeRSA = require('node-rsa');
const Module = graphene.Module;

const lgoPublicKeyLabel = 'PublicKeyLGO';
const lgoPrivateKeyLabel = 'PrivateKeyLGO';

class Signer {
  constructor(dependencies) {
    const { libraryPath, pin, logger } = dependencies;
    this.mod = Module.load(libraryPath, 'SoftHSM');
    this.pin = pin;
    this.logger = logger;
  }

  initialize() {
    try {
      this.mod.initialize();
      const slot = this.mod.getSlots(0);
      slot.initToken(this.pin, 'LGO token');
      const session = slot.open(
        graphene.SessionFlag.RW_SESSION | graphene.SessionFlag.SERIAL_SESSION
      );
      session.login(this.pin, graphene.UserType.SO);
      session.initPin(this.pin);
      session.logout();
      session.close();
    } finally {
      this._finalizeModSilently();
    }
  }

  isHsmInitialized() {
    try {
      this.mod.initialize();
      const slot = this.mod.getSlots(0);
      if (slot.flags & graphene.SlotFlag.TOKEN_PRESENT) {
        const token = slot.getToken();
        return (token.flags & graphene.TokenFlag.TOKEN_INITIALIZED) !== 0;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      this._finalizeModSilently();
    }
  }

  ensureRSAKeyAvailable() {
    this._openClose(session => {
      const publicKeys = session.find({ label: lgoPublicKeyLabel });
      if (publicKeys.length === 0) {
        this._generateKeyPair(session);
      }
    });
  }

  _generateKeyPair(session) {
    session.generateKeyPair(
      graphene.KeyGenMechanism.RSA,
      {
        keyType: graphene.KeyType.RSA,
        modulusBits: 2048,
        publicExponent: new Buffer([3]),
        token: true,
        verify: true,
        encrypt: true,
        wrap: true,
        label: lgoPublicKeyLabel
      },
      {
        keyType: graphene.KeyType.RSA,
        token: true,
        sign: true,
        decrypt: true,
        unwrap: true,
        label: lgoPrivateKeyLabel
      }
    );
  }

  getRSAPublicKey() {
    return this._openClose(session => {
      const publicKey = session
        .find({ label: lgoPublicKeyLabel })
        .items(0)
        .toType();
      const pubKey = publicKey.getAttribute({
        modulus: null,
        publicExponent: null
      });
      return new NodeRSA()
        .importKey(
          {
            n: pubKey.modulus,
            e: 3
          },
          'components-public'
        )
        .exportKey('pkcs8-public');
    });
  }

  sign(data) {
    return this._openClose(session => {
      const privateKey = session
        .find({ label: lgoPrivateKeyLabel })
        .items(0)
        .toType();
      const sign = session.createSign('SHA256_RSA_PKCS', privateKey);
      sign.update(data);
      const signature = sign.final();
      return signature.toString('hex');
    });
  }

  _openClose(func) {
    try {
      let result;
      this.mod.initialize();
      const slot = this.mod.getSlots(0);
      if (slot.flags & graphene.SlotFlag.TOKEN_PRESENT) {
        const session = slot.open(
          graphene.SessionFlag.RW_SESSION | graphene.SessionFlag.SERIAL_SESSION
        );
        this._tryLogin(session);
        result = func(session);
        session.logout();
        session.close();
      }
      return result;
    } finally {
      this._finalizeModSilently();
    }
  }

  _tryLogin(session) {
    try {
      session.login(this.pin);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  _finalizeModSilently() {
    try {
      this.mod.finalize();
    } catch (error) {
      this.logger.error('Cannot finalize mod', error);
    }
  }
}

module.exports = { Signer };
