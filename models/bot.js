var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;

var BotSchema = mongoose.Schema({
    email: String,
    password: String,
    //rules        : [Rule]
    rules: [{type: ObjectId, ref: 'Rule'}]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Bot', BotSchema);

