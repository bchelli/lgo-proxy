'use strict';

const moment = require('moment');

const { KeyRepository } = require('../../domain');
const { examples, MockHttp, SilentLogger } = require('../../test');
const { createDownloadKeys } = require('./downloadKeys');

describe('Download keys', () => {
  let downloadKeys;
  let createDate;
  let keyRepository;
  let http;

  beforeEach(() => {
    const configuration = {
      keys: {
        url: 'key-server',
        downloadConcurrency: 1
      }
    };
    createDate = jest.fn().mockReturnValue(examples.june);
    keyRepository = new KeyRepository({
      logger: new SilentLogger(),
      createDate
    });
    http = new MockHttp();
    downloadKeys = createDownloadKeys({
      configuration,
      logger: new SilentLogger(),
      createDate,
      keyRepository,
      http
    });
  });

  it('should save keys with public keys based on index', async () => {
    configureHttp();

    await downloadKeys();

    expect(keyRepository.getAll()).toEqual([
      {
        id: '123',
        enabledAt: moment.utc('2018-06-01T00:00:00Z').toDate(),
        disabledAt: moment.utc('2018-07-01T00:00:00Z').toDate(),
        publicKey: createPublicKey()
      },
      {
        id: '456',
        enabledAt: moment.utc('2018-07-01T00:00:00Z').toDate(),
        disabledAt: moment.utc('2018-08-01T00:00:00Z').toDate(),
        publicKey: createAnotherPublicKey()
      }
    ]);
  });

  it('should omit expired keys', async () => {
    createDate.mockReturnValue(examples.july);
    configureHttp();

    await downloadKeys();

    const keys = keyRepository.getAll();
    expect(keys).toHaveLength(1);
    expect(keys[0]).toMatchObject({ id: '456' });
  });

  it('should handle a poorly formatted index', async () => {
    const createIndex = () => {
      return (
        '\n' +
        '123 2018-06-01T00:00:00Z 2018-07-01T00:00:00Z\n' +
        '456 2018-07-01T00:00:00Z 2018-08-01T00:00:00Z\n' +
        '\n'
      );
    };
    configureHttp({ createIndex });

    await downloadKeys();

    expect(keyRepository.getAll()).toMatchObject([
      { id: '123' },
      { id: '456' }
    ]);
  });

  function configureHttp(options = {}) {
    const safeOptions = {
      index: createIndex(),
      publicKey: createPublicKey(),
      anotherPUblicKey: createAnotherPublicKey(),
      ...options
    };
    const { index, publicKey, anotherPUblicKey } = safeOptions;
    http.get = jest.fn().mockImplementation(url => {
      switch (url) {
        case 'key-server/index.txt':
          return index;
        case 'key-server/123_public.pem':
          return publicKey;
        case 'key-server/456_public.pem':
          return anotherPUblicKey;
        default:
          throw new Error(`404: ${url}`);
      }
    });
  }

  function createIndex() {
    return (
      '123 2018-06-01T00:00:00Z 2018-07-01T00:00:00Z\n' +
      '456 2018-07-01T00:00:00Z 2018-08-01T00:00:00Z'
    );
  }

  function createPublicKey() {
    return (
      '-----BEGIN PUBLIC KEY-----\n' +
      'MIIBIDANB\n' +
      '-----END PUBLIC KEY-----'
    );
  }

  function createAnotherPublicKey() {
    return (
      '-----BEGIN PUBLIC KEY-----\n' +
      'DANBMIIBI\n' +
      '-----END PUBLIC KEY-----'
    );
  }
});
