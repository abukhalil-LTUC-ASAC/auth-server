'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = 'mytokensecret';

  /**
 * defines the static schema that is used universally as 
 * username and password
 */
const USERS = mongoose.model('CustomerModel', {
  username: { type: String, required: true },
  password: { type: String, required: true }
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
          console.log('new Record', record)
      } catch(e) {
          console.log("error in bcrypt: ", e)
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
    return USERS.find({});
  }
//   /**
//  * updates the specified _id with the record object
//  * @param {String} _id is a mongoose generated ID to search for
//  * @param {object} record is a valid object input ready to use in schema.
//  */
//   update(_id, record) {
//     return this.schema.findByIdAndUpdate(_id, record);
//   }
//   /**
//  * deletes the specified ID from mongoose db
//  * @param {String} _id is a mongoose generated ID to search for
// */
//   delete(_id) {
//     return this.schema.findByIdAndDelete(_id);
//   }

  async authenticateBasic(user, password) {
    let userDB = await USERS.findOne({ username: user });
    console.log('userSB', userDB);

    if (userDB) {
        let valid = await bcrypt.compare(password, userDB.password);
        return valid ? userDB : Promise.reject();
    }

    return Promise.reject();
  };

  async generateToken(user) {

    let token = jwt.sign({username: user.username}, SECRET);
    return token;
  };
}

module.exports = new Model();
