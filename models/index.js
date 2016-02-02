var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var projectSchema = new Schema({
  title: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  repo: String,
  website: String,
  description: String,
  tags: [String],
  imgPath: String,
  upVotes: Number
})


var userSchema = new Schema({
  firstName: String,
  lastName: String,
  githubName: String,
  projects: [{mongoose.Schema.Types.ObjectId, ref: 'Project'}],
  ideas: [{mongoose.Schema.Types.ObjectId, ref: 'Idea'}]
})

var ideaSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: String,
  description: String,
  upVotes: Number
})


var Project = mongoose.model('Project', projectSchema);
var User = mongoose.model('User', userSchema);
var Idea = mongoose.model('Idea', ideaSchema);


if(process.env.NODE_ENV === 'production') {
   var db = mongoose.connect(process.env.MONGOLAB_URI).connection;
} else {
  mongoose.connect('mongodb://localhost/APPNAME'); 
  var db = mongoose.connection;
}


module.exports = {
  Project: Project,
  Idea: Idea,
  User: User
}