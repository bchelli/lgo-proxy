'use strict';

const MockResponse = jest.fn(() => ({
  end: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  setHeader: jest.fn().mockReturnThis()
}));

module.exports = { MockResponse };
