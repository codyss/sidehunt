var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var projectSchema = new Schema({
  title: String,
  urlTitle: String,
  githubName: String,
  githubData: Schema.Types.Mixed,
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  repo: String,
  website: String,
  description: String,
  tags: [String],
  imgPath: String,
  upVotes: {type: Number, default: 0},
  upVoters: [String]
});

projectSchema.pre('validate', function(next) {
  this.urlTitle = urlify(this.title);
  next();
});

projectSchema.pre('save', function(next) {
  this.githubName = nameFromRepo(this.repo);
  next();
})

projectSchema.pre('save', function(next) {
  this.githubData = "https://api.github.com/users/" + this.githubName;
  next();
})


projectSchema.virtual('route').get(function() {
  return '/projects/' + this.urlTitle;
});

var userSchema = new Schema({
  githubName: String,
  projects: [{type: Schema.Types.ObjectId, ref: 'Project'}],
  ideas: [{type: Schema.Types.ObjectId, ref: 'Idea'}]
});

userSchema.virtual('githubAPI').get(function() {
  return 'https://api.github.com/users/' + this.githubName;
})

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

function nameFromRepo (address) {
  var adArr = address.split('/');
  return adArr.slice(-2,-1);
}

function arrayify (tags) {
  return tags.join(', ');
}
