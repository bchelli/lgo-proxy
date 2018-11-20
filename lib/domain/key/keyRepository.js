'use strict';

const { orderBy } = require('lodash/fp');

const { MemoryRepository } = require('../../tools');

class KeyRepository extends MemoryRepository {
  constructor(dependencies) {
    super(dependencies);
    const { createDate } = dependencies;
    this.createDate = createDate;
  }

  getCurrent() {
    const now = this.createDate();
    const currents = this.getAll().filter(
      k => k.enabledAt <= now && now < k.disabledAt
    );
    if (currents.length === 0) {
      return null;
    }
    const orderedKeys = orderBy(
      ['disabledAt', 'enabledAt'],
      ['desc', 'desc'],
      currents
    );
    return orderedKeys[0];
  }
}

module.exports = { KeyRepository };
