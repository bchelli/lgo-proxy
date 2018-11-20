'use strict';

const WebSocket = require('ws');

/* eslint-disable no-console */

const socket = new WebSocket('ws://localhost:3002');

socket.on('message', console.log);
socket.on('error', console.error);

socket.on('open', socketOpen);

function socketOpen() {
  const message = {
    type: 'subscribe',
    channels: [
      {
        name: 'user',
        product_id: 'BTC-USD'
      },
      {
        name: 'afr'
      },
      {
        name: 'level2',
        product_id: 'BTC-USD'
      }
    ]
  };
  socket.send(JSON.stringify(message), messageSent);
}

function messageSent(error) {
  if (error) {
    console.error('Message cannot be sent', error);
  }
}
