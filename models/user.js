var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	username: String,
	password: String
});

userSchema.methods.passwordHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.passwordSet = function (password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.passwordIsValid = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var user = mongoose.model('User', userSchema);

module.exports = user;
