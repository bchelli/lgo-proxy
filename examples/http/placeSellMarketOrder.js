'use strict';

const axios = require('axios');

/* eslint-disable no-console */

const order = {
  type: 'M',
  side: 'S',
  product_id: 'BTC-USD',
  quantity: '0.01'
};

axios
  .post('http://localhost:3002/orders', order)
  .then(response =>
    console.log(`Code: ${response.status}, data:`, response.data)
  )
  .catch(error =>
    console.error(`Code: ${error.response.status}, data:`, error.response.data)
  );
