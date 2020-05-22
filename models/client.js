  var mongoose = require('mongoose')

var clientSchema = new mongoose.Schema({
    username: String,
    password: String,
    userType: String,
    key: String,
})

module.exports = mongoose.model("client", clientSchema)