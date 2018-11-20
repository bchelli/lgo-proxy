'use strict';

const axios = require('axios');

/* eslint-disable no-console */

const orderId = process.argv[2] || '154211262112400001';

axios
  .delete(`http://localhost:3002/orders/${orderId}`)
  .then(response =>
    console.log(`Code: ${response.status}, data:`, response.data)
  )
  .catch(error =>
    console.error(`Code: ${error.response.status}, data:`, error.response.data)
  );
