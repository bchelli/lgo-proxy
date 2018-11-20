'use strict';

function createStatusGet() {
  return (_, response) => {
    response.sendStatus(200);
  };
}

module.exports = { createStatusGet };
