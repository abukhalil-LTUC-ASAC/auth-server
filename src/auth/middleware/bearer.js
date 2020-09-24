'use strict';

const users = require('../models/users-model');

module.exports = (req, res, next)=> {
  if (!req.headers.authorization) {
    return next('Invalid Login, No Headers !!');
  }
  console.log('req.headers.authoriation : ',req.headers.authorization);
  let bearer = req.headers.authorization.split(' ');
   
  if (bearer[0] == 'Bearer') {
    const token = bearer[1];
    users.authenticateToken(token).then(validUser=> {
      console.log('validUser ---> ',validUser);
      req.user = validUser;
      next();
    }).catch(err=> next('Invalid Token!'));

  } else {
    return next('Invalid Bearer!!');
  }





};