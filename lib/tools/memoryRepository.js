'use strict';

class MemoryRepository {
  constructor(dependencies) {
    const { logger } = dependencies;
    this.logger = logger;
    this.entities = new Map();
  }

  getById(id) {
    this.logger.debug('Getting entity with id %s', id);
    if (!this.entities.has(id)) {
      throw new Error(`Missing entity with id ${id}`);
    }
    return this.entities.get(id);
  }

  getAll() {
    return Array.from(this.entities.values());
  }

  save(...entities) {
    for (let entity of entities) {
      this.logger.debug('Saving entity with id %s', entity.id);
      const { id } = entity;
      this.entities.set(id, entity);
    }
  }
}

module.exports = { MemoryRepository };
