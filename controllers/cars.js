const mongoose = require('mongoose');

const cars_schema = mongoose.Schema({
    name: String,
    fuel: String,
    model: String,
    speed: String,
    price: String
});

module.exports = mongoose.model('cars', cars_schema);