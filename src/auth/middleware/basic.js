'use strict';

const base64 = require('base-64');
const users = require('../models/users-model');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization.split(' ');
  if(auth[0] == 'Basic') {
    const [username, password] = base64.decode(auth[1]).split(':'); 
    users.authenticateBasic(username, password).then(validUser=>{
      let token = users.generateToken(validUser);
      req.token = token;
      req.user = validUser;
      next();
        
    }).catch(err=> next(err));
  } else {
    next('Invalid Login!! ');
  }
};