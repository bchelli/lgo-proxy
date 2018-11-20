'use strict';

const { examples, SilentLogger } = require('../../test');
const { KeyRepository } = require('./keyRepository');

describe('Key repository', () => {
  let createDate;
  let repository;

  beforeEach(() => {
    createDate = jest.fn().mockReturnValue(examples.june);
    repository = new KeyRepository({ createDate, logger: new SilentLogger() });
  });

  describe('on get current', () => {
    it('should get a enabled now key', async () => {
      repository.entities.set(
        examples.keyFromMayToJune.id,
        examples.keyFromMayToJune
      );
      repository.entities.set(
        examples.keyFromJuneToJuly.id,
        examples.keyFromJuneToJuly
      );
      repository.entities.set(
        examples.keyFromJulyToAugust.id,
        examples.keyFromJulyToAugust
      );

      const key = repository.getCurrent();

      expect(key).toEqual(examples.keyFromJuneToJuly);
    });

    it('should get the most recent enabled now key', async () => {
      repository.entities.set(
        examples.keyFromMidMayToMidJune.id,
        examples.keyFromMidMayToMidJune
      );
      repository.entities.set(
        examples.keyFromJuneToJuly.id,
        examples.keyFromJuneToJuly
      );

      const key = repository.getCurrent();

      expect(key).toEqual(examples.keyFromJuneToJuly);
    });

    it('should ignore a key still not enabled now', async () => {
      createDate.mockReturnValue(examples.may);
      repository.entities.set(
        examples.keyFromMayToJune.id,
        examples.keyFromMayToJune
      );
      repository.entities.set(
        examples.keyFromJuneToJuly.id,
        examples.keyFromJuneToJuly
      );

      const key = repository.getCurrent();

      expect(key).toEqual(examples.keyFromMayToJune);
    });

    it('should return nothing if all keys are disabled', () => {
      createDate.mockReturnValue(examples.august);
      repository.entities.set(
        examples.keyFromMidMayToMidJune.id,
        examples.keyFromMidMayToMidJune
      );
      repository.entities.set(
        examples.keyFromJuneToJuly.id,
        examples.keyFromJuneToJuly
      );

      const key = repository.getCurrent();

      expect(key).toBeNull();
    });
  });
});
