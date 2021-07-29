var express = require('express');
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var router = express.Router();

var Schema = mongoose.Schema;

var User = new Schema({
  firstname: {
    type: String,
      default: ''
  },
  lastname: {
    type: String,
      default: ''
  },
  admin:   {
      type: Boolean,
      default: false
  }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
