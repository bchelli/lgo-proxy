'use strict';

const { Signer } = require('../tools/signer');

/* eslint-disable no-console */

const libraryPath = process.env['LGO_SIGNER_LIBRARY_PATH'];

if (!libraryPath) {
  console.error('LGO_SIGNER_LIBRARY_PATH must be defined');
  process.exit(-1);
}

const pin = process.env['LGO_SIGNER_PIN'] || '0000';

const signer = new Signer({ libraryPath, pin, logger: console });
if (!signer.isHsmInitialized()) {
  console.error('Hsm not initialised');
  process.exit(-1);
}
console.log(signer.getRSAPublicKey());
