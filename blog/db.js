var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	name: String,
	password: String,
	email: String
});

mongoose.model('User', User);
mongoose.connect('mongodb://localhost/blog');