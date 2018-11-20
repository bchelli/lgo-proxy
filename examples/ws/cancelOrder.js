'use strict';

const WebSocket = require('ws');
const axios = require('axios');

/* eslint-disable no-console */

const orderId = process.argv[2] || '154211262112400001';

const socket = new WebSocket('ws://localhost:3002');

socket.on('message', console.log);
socket.on('error', console.error);
socket.on('open', socketOpen);

function socketOpen() {
  const cancel = { order_id: orderId };

  axios.post('http://localhost:3002/prepare-cancel', cancel).then(response => {
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
