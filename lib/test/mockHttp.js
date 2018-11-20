'use strict';

const MockHttp = jest.fn(() => ({
  get: jest.fn().mockResolvedValue(undefined)
}));

module.exports = { MockHttp };
