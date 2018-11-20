'use strict';

const { ResourceNotFoundError } = require('../../errors');
const { createNotFoundMiddleware } = require('./notFoundMiddleware');

describe('Not found middleware', () => {
  let middleware;
  let next;

  beforeEach(() => {
    next = jest.fn().mockReturnValue(undefined);
    middleware = createNotFoundMiddleware();
  });

  it('should call next with a ResourceNotFound error', () => {
    middleware({}, {}, next);

    expect(next).toHaveBeenCalledWith(new ResourceNotFoundError());
  });
});
