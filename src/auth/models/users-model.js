'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = 'mytokensecret';
/**
 * defines actions specified for each role 
 */
let roles = {
  user: ['read'],
  writer: ['read', 'create'],
  editor: ['read', 'create', 'update'],
  admin: ['read', 'create', 'update', 'delete'],
};
  /**
 * defines the static schema that is used universally as 
 * username and password
 */
const USERS = mongoose.model('CustomerModel', {
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'writer', 'editor', 'admin']},
});

class Model {

  constructor() {

  }

  /**
 * creates the record object as a new mongoose entry 
 * @param {object} record is a valid object input ready to use in schema.
 */
  async create(record) {
    console.log('Check for ', record);

    let userDB = await USERS.findOne({ username: record.username });
    console.log('userDB', userDB);
    if (!userDB) {
      // save user if it does not exist
      try {
        record.password = await bcrypt.hash(record.password, 5);
        console.log('new Record', record);
      } catch(e) {
        console.log('error in bcrypt: ', e);
      }

      let newRecord = new USERS(record);
      return newRecord.save();
    }

    return 'User Exists!';
  }
  /**
 * gets the specified ID from mongoose db
 * @param {String} _id is a mongoose generated ID to search for
*/
  get(_id) {  
    return _id ? USERS.find({_id}) : USERS.find({});
  }

  /**
 * gets the specified ID from mongoose db
 * @param {String} _id is a mongoose generated ID to search for
*/
  update(_id) {  
    return _id ? USERS.findByIdAndUpdate({_id}) : Promise.reject();
  }

  /**
 * gets the specified ID from mongoose db
 * @param {String} _id is a mongoose generated ID to search for
*/
  delete(_id) {  
    return _id ? USERS.findByIdAndDelete() : Promise.reject();
  }

  /**
 * gets the specified ID from mongoose db
 * @param {String} user is the user data that would be authenticated
 * @param {String} password is the password that will be compared locally 
*/
  async authenticateBasic(user, password) {
    let userDB = await USERS.findOne({ username: user });
    console.log('userSB', userDB);

    if (userDB) {
      let valid = await bcrypt.compare(password, userDB.password);
      return valid ? userDB : Promise.reject();
    }

    return;  
  }
  /**
 * gets the specified ID from mongoose db
 * @param {String} user is the string used to generate a token associated with it
 * 
*/
  generateToken(user) {
    let token = jwt.sign({
      username: user.username,
      actions: roles[user.role],
    }, SECRET);
    console.log(token);
    return token;
  }
  /**
 * gets the specified ID from mongoose db
 * @param {String} token will be compared locally for a quick and 
 * streamlined authentication for every other request shortly after signin.
 * 
*/
  async authenticateToken(token) {
    try {
      let tokenObject = jwt.verify(token, SECRET);
      let userDB = await USERS.findOne({ username: tokenObject.username });
      if (userDB) {
        return Promise.resolve({
          tokenObject: tokenObject,
          user: userDB,
        });
      } else {
        return Promise.reject();
      }
    } catch(e) {
      return Promise.reject();
    }
  }
}

module.exports = new Model();
