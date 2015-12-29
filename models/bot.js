var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var botSchema = mongoose.Schema({
    email        : String,
    password     : String,
    rules            : {

    }
});


botSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
botSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Bot', botSchema);