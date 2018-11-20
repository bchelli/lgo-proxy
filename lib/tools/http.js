'use strict';

const axios = require('axios');

class Http {
  get(url) {
    return axios.get(url).then(r => r.data);
  }
}

module.exports = { Http };
