'use strict';
/**
 * gets the specified ID from mongoose db
 * @param {String} action is a route middleware input to validated needed action permission
*/
module.exports = (action) => {
  return (req, res, next) => {
    console.log('req.user.actions +++++++++', req.user.tokenObject.actions);
    try {
      if (req.user.tokenObject.actions.includes(action)) {
        next();
      } else {
        next('Invalid Action');
      }
    } catch (e) {
      next('Invalid no actions specified!');
    }
  };
};