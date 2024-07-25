const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    uuid : String,
    title : String,
    content : String,
    author: String
});

module.exports = mongoose.model('Article', articleSchema);