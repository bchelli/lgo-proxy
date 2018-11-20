'use strict';

const { examples, SilentLogger } = require('../test');
const { MemoryRepository } = require('./memoryRepository');

describe('Memory repository', () => {
  let repository;

  beforeEach(() => {
    repository = new MemoryRepository({ logger: new SilentLogger() });
  });

  describe('on get by id', () => {
    it('should return the corresponding entity', () => {
      repository.entities.set(examples.uuid, {
        id: examples.uuid,
        firstName: 'John'
      });
      repository.entities.set(examples.uuid2, {
        id: examples.uuid2,
        firstName: 'Billy'
      });

      const person = repository.getById(examples.uuid2);

      expect(person).toEqual({ id: examples.uuid2, firstName: 'Billy' });
    });

    it('should reject when root does not exist', () => {
      const getById = () => repository.getById(examples.uuid);

      expect(getById).toThrow(`Missing entity with id ${examples.uuid}`);
    });
  });

  describe('on get all', () => {
    it('should return all entities', () => {
      repository.entities.set(examples.uuid, {
        id: examples.uuid,
        firstName: 'John'
      });
      repository.entities.set(examples.uuid2, {
        id: examples.uuid2,
        firstName: 'Billy'
      });

      const persons = repository.getAll();

      expect(persons).toEqual([
        { id: examples.uuid, firstName: 'John' },
        { id: examples.uuid2, firstName: 'Billy' }
      ]);
    });
  });

  describe('on save', () => {
    it('should add entity', () => {
      const person = { id: examples.uuid, firstName: 'John' };

      repository.save(person);

      expect(repository.entities.get(examples.uuid)).toEqual({
        id: examples.uuid,
        firstName: 'John'
      });
    });

    it('could add entities', () => {
      const person = { id: examples.uuid, firstName: 'John' };
      const otherPerson = { id: examples.uuid2, firstName: 'Bob' };

      repository.save(person, otherPerson);

      expect(repository.entities.get(examples.uuid)).toEqual(person);
      expect(repository.entities.get(examples.uuid2)).toEqual(otherPerson);
    });
  });
});
