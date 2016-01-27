var mongoose = require('mongoose');
Schema = mongoose.Schema;
var RuleSchema = mongoose.Schema({
    command: String,
    type: String,
    reply: Boolean,
    response: [String]
});

module.exports = mongoose.model('Rule', RuleSchema);
