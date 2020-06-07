const mongoose = require('mongoose');

const users_schema = mongoose.Schema({
    username: String,
    email: String,
    password: String
});

module.exports = mongoose.model('users', users_schema);