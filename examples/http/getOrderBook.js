'use strict';

const axios = require('axios');

/* eslint-disable no-console */

axios
  .get('http://localhost:3002/products/BTC-USD/book?level=1')
  .then(response =>
    console.log(`Code: ${response.status}, data:`, response.data)
  )
  .catch(error =>
    console.error(`Code: ${error.response.status}, data:`, error.response.data)
  );
