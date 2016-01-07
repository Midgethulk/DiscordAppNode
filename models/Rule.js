var mongoose = require('mongoose');
Schema = mongoose.Schema;
var Bot = require('../models/bot')
var ObjectId = mongoose.Schema.Types.ObjectId;

var RuleSchema = mongoose.Schema({
    command: String,
    bot: {type: ObjectId, ref: 'Bot'},
    response: {
        type: String,
        response: [String]
    }

});

module.exports = mongoose.model('Rule', RuleSchema);
