'use strict';

const { createStatusGet } = require('./statusGet');
const { MockResponse } = require('../../test');

describe('Status get', () => {
  let handler;

  beforeEach(() => {
    handler = createStatusGet();
  });

  it('should send a 200 OK', async () => {
    const response = new MockResponse();

    await handler({}, response);

    expect(response.sendStatus).toHaveBeenCalledWith(200);
  });
});
