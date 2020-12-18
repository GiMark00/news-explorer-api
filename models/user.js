const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /\w+@\w+.\w+/i,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    hide: true,
    match: /\w{10,}/i,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
