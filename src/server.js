'use strict';

// requirements constants
const express = require('express');
const app = express();
const cors = require('cors');

const notFoundHandler = require('./middleware/404');
const serverErrorHandler = require('./middleware/500');
// const getModel = require('./middleware/model-finder');
const usersModel = require('./auth/models/users-model');
const basicAuth = require('./auth/middleware/basic');
const bearerAuth = require('./auth/middleware/bearer');
const aclMiddleWare = require('./auth/middleware/acl-middleware');

// Global MiddleWare where you could call it anywhere and has a global scope
app.use(express.json());
app.use(cors());
app.use(serverErrorHandler);

// routes as MiddleWare
// generic model
app.post('/signup', postAuthDetails);
app.post('/signin', basicAuth, verifyAuthDetails);

app.get('/users/', bearerAuth, aclMiddleWare('read'), getUserDetails);
app.get('/users/:id', bearerAuth, aclMiddleWare('read'), getUserDetails);
app.put('/users/:id', bearerAuth, aclMiddleWare('update'), updateUserDetails);
app.delete('/users/:id', bearerAuth, aclMiddleWare('delete'), deleteUserDetails);
// get model
// app.param('model', getModel);

// error routes
app.use('*', notFoundHandler);

// ----------------------------------- functions categories ----------------------------------- //
async function postAuthDetails(req, res, next) {
  console.log('here in post');
  usersModel.create(req.body).then(user => {
    res.status(200).send(user);  
  }).catch(err=> {
    console.log(err);
    next(err);
  });
}

function verifyAuthDetails(req, res, next) {
  if (req.token) {
    res.status(200).send({
      token: req.token,
      user: req.user,
    });
  } else {
    res.status(401).send('User Does Not Exists!');
  }
}

function getUserDetails(req, res, next) {
  let id = req.params.id;
  usersModel.get(id).then(data => {
    let output = {
      count: 0,
      results: [],
    };

    output.count = data.length;
    output.results = data;
    res.status(200).json(output);
  }).catch(err=> {
    console.log(err);
    next(err);
  });
}

function updateUserDetails(req, res, next) {
  let id = req.params.id;
  usersModel.update(id).then(data => {
    res.status(200).json(data);
  }).catch(err=> {
    console.log(err);
    next(err);
  });
}

function deleteUserDetails(req, res, next) {
  let id = req.params.id;
  usersModel.delete(id).then(data => {
    res.status(200).json(data);
  }).catch(err=> {
    console.log(err);
    next(err);
  });
}

module.exports = {
  server: app, 
  start: port => {
    let PORT = port || process.env.port || 3000;
    app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));
  },
};