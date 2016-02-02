var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var modelSchema = new Schema({
})


var Model = mongoose.model('Model', modelSchema)


if(process.env.NODE_ENV === 'production') {
   var db = mongoose.connect(process.env.MONGOLAB_URI).connection;
}else{
  mongoose.connect('mongodb://localhost/APPNAME'); 
  var db = mongoose.connection;
}


module.exports = {
  Model: Model
}