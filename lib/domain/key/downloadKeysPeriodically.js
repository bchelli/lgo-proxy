'use strict';

const { CronJob } = require('cron');

function createDownloadKeysPeriodically(dependencies) {
  const { downloadKeys, logger, configuration } = dependencies;
  return () => {
    logger.info('Downloading keys periodically');
    try {
      const job = new CronJob({
        cronTime: configuration.keys.downloadPattern,
        onTick,
        context: { running: false },
        runOnInit: true
      });
      job.start();
      return () => job.stop();
    } catch (error) {
      throw new Error(`Impossible to start download job: ${error.message}`);
    }
  };

  async function onTick() {
    if (this.running) {
      logger.warn('Already downloading keys');
      return;
    }
    this.running = true;
    try {
      await downloadKeys();
    } catch (error) {
      logger.error('Job failed', error);
    } finally {
      this.running = false;
    }
  }
}

module.exports = { createDownloadKeysPeriodically };
