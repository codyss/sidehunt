var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var projectSchema = new Schema({
  title: String,
  urlTitle: String,
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  repo: String,
  website: String,
  description: String,
  tags: [String],
  imgPath: String,
  upVotes: {type: Number, default: 0}
});

projectSchema.pre('validate', function(next) {
  this.urlTitle = urlify(this.title);
  next();
});

projectSchema.virtual('route').get(function() {
  return '/projects/' + this.urlTitle;
});


var userSchema = new Schema({
  firstName: String,
  lastName: String,
  githubName: String,
  projects: [{type: Schema.Types.ObjectId, ref: 'Project'}],
  ideas: [{type: Schema.Types.ObjectId, ref: 'Idea'}]
});

var ideaSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  title: String,
  description: String,
  upVotes: {type: Number, default: 0}
});


var Project = mongoose.model('Project', projectSchema);
var User = mongoose.model('User', userSchema);
var Idea = mongoose.model('Idea', ideaSchema);


if(process.env.NODE_ENV === 'production') {
   var db = mongoose.connect(process.env.MONGOLAB_URI).connection;
} else if (process.env.NODE_ENV === 'testing') {
  mongoose.connect('mongodb://localhost/sidelist-testing'); 
  var db = mongoose.connection;
} else {
  mongoose.connect('mongodb://localhost/sidelistdev'); 
  var db = mongoose.connection; 
}


module.exports = {
  Project: Project,
  Idea: Idea,
  User: User
}


function urlify (str){
    return str ? str.replace(/\s/g, "_").replace(/\W/g, ""): Math.random().toString(36).substring(2, 7);
}

function arrayify (tags) {
  return tags.join(', ');
}
