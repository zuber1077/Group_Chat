
const mongoose = require('mongoose');

const gpNames = mongoose.Schema({
    name: {type: String, default: ''},
   // filename: {type: String, default: ''},
    country: {type: String, default: ''},
    image: {type: String, default: 'default.png'},
    fans: [{
        username: {type: String, default: ''},
        email: {type: String, default: ''}
    }]
});

module.exports = mongoose.model('gpNames',gpNames);