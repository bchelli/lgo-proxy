'use strict';

const moment = require('moment');

const juneIso = '2018-06-01T00:00:00.000Z';

const may = moment.utc('2018-05-01').toDate();
const midMay = moment.utc('2018-05-15').toDate();
const june = moment.utc('2018-06-01').toDate();
const midJune = moment.utc('2018-06-15').toDate();
const july = moment.utc('2018-07-01').toDate();
const august = moment.utc('2018-08-01').toDate();

const key = {
  id: '123',
  publicKey: 'pub key'
};

const otherKey = {
  id: '456',
  publicKey: 'another pub key'
};

const uuid = '7e0028b6-346d-4ff4-b5f7-e781a87dd8ac';
const uuid2 = 'ea0da71d-3040-4fbf-b8aa-636fa1a09940';

const keyFromMayToJune = {
  id: '123',
  enabledAt: may,
  disabledAt: june
};

const keyFromMidMayToMidJune = {
  id: 'abc',
  enabledAt: midMay,
  disabledAt: midJune
};

const keyFromJuneToJuly = {
  id: '456',
  enabledAt: june,
  disabledAt: july
};

const keyFromJulyToAugust = {
  id: '789',
  enabledAt: july,
  disabledAt: august
};

const examples = {
  juneIso,
  may,
  june,
  july,
  august,
  key,
  otherKey,
  uuid,
  uuid2,
  keyFromMayToJune,
  keyFromMidMayToMidJune,
  keyFromJuneToJuly,
  keyFromJulyToAugust
};

module.exports = { examples };
