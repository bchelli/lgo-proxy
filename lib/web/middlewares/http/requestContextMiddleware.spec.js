'use strict';

const {
  createRequestContextMiddleware
} = require('./requestContextMiddleware');

describe('Request context middleware', () => {
  let middleware;
  let next;

  beforeEach(() => {
    next = jest.fn().mockReturnValue(undefined);
    middleware = createRequestContextMiddleware();
  });

  it('should populate a request context', () => {
    const request = { url: 'http://server', method: 'POST' };

    middleware(request, {}, next);

    expect(request.context).toEqual({ url: 'http://server', method: 'POST' });
    expect(next).toHaveBeenCalled();
  });
});
