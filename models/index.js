'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const nconf = require('../nconf.js');

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${nconf.get('DB_HOSTNAME')}:${nconf.get('DB_PORT')}/${nconf.get('DB_NAME')}`,
  {
    user: nconf.get('DB_USER'),
    password: nconf.get('DB_PASSWORD')
  },
  () => {
    console.log("Connected to the DATABASE");
  }
);

fs.readdirSync(__dirname).filter(function (file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function (file) {
  require(path.join(__dirname, file));
});

module.exports = mongoose;
