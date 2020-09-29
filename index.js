'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const server = require('./src/server.js');
const MONGOOSE_URL = 'mongodb://localhost:27017/auth-db';

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

mongoose.connect(MONGOOSE_URL, mongooseOptions);

server.start(3000);
