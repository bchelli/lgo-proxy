'use strict';

const moment = require('moment');
const { mapWithOptions } = require('@arpinum/promising');

function createDownloadKeys(dependencies) {
  const {
    configuration,
    createDate,
    logger,
    keyRepository,
    http
  } = dependencies;
  return async () => {
    try {
      logger.info('Downloading keys');
      const now = createDate();
      const index = await downloadIndex();
      const notExpiredSummaries = filterNotExpiredSummaries(index, now);
      const keys = await downloadPublicKeys(notExpiredSummaries);
      keyRepository.save(...keys);
    } catch (error) {
      throw new Error(`Impossible to download keys: ${error.message}`);
    }
  };

  async function downloadIndex() {
    try {
      const url = `${configuration.keys.url}/index.txt`;
      const data = await http.get(url);
      return parseSummaries(data);
    } catch (error) {
      throw new Error(`Impossible to download index: ${error.message}`);
    }
  }

  function parseSummaries(text) {
    return text.split('\n').reduce((result, row) => {
      const summary = parseSummary(row);
      if (summary) {
        result.push(summary);
      }
      return result;
    }, []);
  }

  function parseSummary(line) {
    const columns = line.split(' ');
    if (columns.length < 3) {
      return null;
    }
    return {
      id: columns[0],
      enabledAt: moment.utc(columns[1]).toDate(),
      disabledAt: moment.utc(columns[2]).toDate()
    };
  }

  function filterNotExpiredSummaries(index, now) {
    return index.filter(k => now < k.disabledAt);
  }

  function downloadPublicKeys(summaries) {
    return mapWithOptions(
      combineWithPublicKey,
      { concurrency: configuration.keys.downloadConcurrency },
      summaries
    );
  }

  async function combineWithPublicKey(summary) {
    try {
      const url = `${configuration.keys.url}/${summary.id}_public.pem`;
      const data = await http.get(url);
      return { ...summary, publicKey: data };
    } catch (error) {
      throw new Error(`Impossible to download public key: ${error.message}`);
    }
  }
}

module.exports = { createDownloadKeys };
