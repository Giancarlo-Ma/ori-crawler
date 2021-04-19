const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: String,
    author: String,
    img: String,
    topic: String,
    date: String
});

module.exports = mongoose.model('book', bookSchema);