'use strict';

const MockSigner = jest.fn(() => ({
  initialize: jest.fn().mockResolvedValue(undefined),
  isHsmInitialized: jest.fn().mockResolvedValue(undefined),
  ensureRSAKeyAvailable: jest.fn().mockResolvedValue(undefined),
  getRSAPublicKey: jest.fn().mockResolvedValue(undefined),
  sign: jest.fn().mockResolvedValue(undefined)
}));

module.exports = { MockSigner };
