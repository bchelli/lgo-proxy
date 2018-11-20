'use strict';

const { createValidation, ValidationError } = require('./validation');

describe('ValidationError', () => {
  it('could be created', () => {
    const errors = [{ message: 'failure' }, { message: 'other failure' }];
    const error = new ValidationError(errors);

    expect(error.message).toEqual('Validation failed');
    expect(error.name).toEqual('ValidationError');
    expect(error.payload).toEqual({ errors });
  });
});

describe('Create validation', () => {
  describe('should return a validation function based on schema', () => {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'string' }
      },
      required: ['id'],
      additionalProperties: false
    };

    it('which succeeds if object satisfies the schema', () => {
      const validate = createValidation(schema);

      validate({ id: 'the id' });
    });

    it('which throws if object does not satisfy the schema', () => {
      const validate = createValidation(schema);

      const doValidate = () => validate({ name: 'Billy' });

      expect(doValidate).toThrow(ValidationError);
    });
  });
});
