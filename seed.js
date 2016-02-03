// This file should contain all the record creation needed to seed the database with its default values.
// The data can then be loaded with the node seed.js 

var Promise = require('bluebird');
var mongoose = require('mongoose');
var models = require('./models');

var data = {
  Project: [
    {title: "Tracelon", repo:'https://github.com/codyss/tracelon', website: null, description: "Purple Trace's quest to build a game" },
    {title: "Express Start", repo:'https://github.com/codyss/expressStart', website: null, description: "Shell for new Express app that uses tools we know and use"}
  ],
  User: [
    {firstName: "Cody", lastName: "Schwarz", githubName: "codyss"}
  ]
};

mongoose.connection.on('open', function() {
  mongoose.connection.db.dropDatabase(function() {

    console.log("Dropped old data, now inserting data");
    Promise.map(Object.keys(data), function(modelName) {
      return Promise.map(data[modelName], function(item) {
        return models[modelName].create(item);
      });
    }).then(function() {
      console.log("Finished inserting data");
    }, console.log).then(function() {
      mongoose.connection.close()
    });

  });
});