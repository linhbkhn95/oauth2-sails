/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var bcrypt = require('bcryptjs');

module.exports = {
  tableName: "SSOUser",
  attributes: {
    username: {
      type: 'string',
      required: true
    },
    hashedPassword: {
      type: 'string'
    },
    tlid: {
      type: 'string'
    },
    fullname: {
      type: 'string'
    },
    // Override toJSON method to remove password from API
    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    },

  },

  beforeCreate: function (values, next) {
    bcrypt.hash(values.password, 10, function (err, hash) {
      if (err) return next(err);
      values.hashedPassword = hash;
      delete values.password;
      next();
    });
  }

};
