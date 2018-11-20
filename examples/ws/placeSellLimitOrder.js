'use strict';

const WebSocket = require('ws');
const axios = require('axios');

/* eslint-disable no-console */

const socket = new WebSocket('ws://localhost:3002');

socket.on('message', console.log);
socket.on('error', console.error);
socket.on('open', socketOpen);

function socketOpen() {
  const order = {
    type: 'L',
    side: 'S',
    product_id: 'BTC-USD',
    quantity: '1',
    price: '6000'
  };

  axios.post('http://localhost:3002/prepare-order', order).then(response => {
    const { data } = response;
    const message = {
      type: 'placeorder',
      order: data
    };
    socket.send(JSON.stringify(message), messageSent);
  });
}

function messageSent(error) {
  if (error) {
    console.error(error);
  }
  socket.close();
}
