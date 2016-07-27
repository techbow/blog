var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var User = new Schema({
	name: String,
	password: String,
	email: String
});
var Blog = new Schema({
	subject: String,
	content: String
});

var conUser = mongoose.createConnection('mongodb://localhost/user');
var conBlog = mongoose.createConnection('mongodb://localhost/blog');

var UserModel = conUser.model('User', User);
var BlogModel = conBlog.model('Blog', Blog);

exports.User = UserModel
exports.Blog = BlogModel
