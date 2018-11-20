'use strict';

const MockRequest = jest.fn(() => ({
  setHeader: jest.fn().mockReturnThis(),
  getHeader: jest.fn().mockReturnThis(),
  removeHeader: jest.fn().mockReturnThis()
}));

module.exports = { MockRequest };
