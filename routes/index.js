var express = require('express');
var router = express.Router();
var request = require('request');
var bootstrapRouter = require('bootstrap-router');
var _ = require('lodash');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var models = require('../models/');


var User = require('../models').User;
var Idea = require('../models').Idea;
var Project = require('../models').Project;


//lodash random for getting a random chat ID


router.get('/', function(req, res, next ){
  //Make side hunt the first project all the time
  Promise.all([
     Project.find({}).populate('user'),
     Idea.find({}).populate('user')
    ])
  .spread(function (projects, ideas) {
      projects.sort(function (a, b) {
        return a.upVotes - b.upVotes;
      });
      projects.reverse();
      ideas.sort(function (a, b) {
        return a.upVotes - b.upVotes;
      });
      ideas.reverse();
      res.render("index", {
      projects: projects,
      ideas: ideas
      });
    })
    .then(null, function (err) {
    console.log(err);
  });
});


router.get('/projects/:title', function (req, res, next) {
    Project.findOne({title: req.params.title})
    .then(function(project) {
      res.render('project', {project: project});
    })
    .then(null, console.error);
    
})

router.get('/ideas/:name', function (req, res, next) {
    Idea.findOne({name: req.params.idea})
    .then(function(idea) {
      res.render('idea', {idea: idea});
    }).then(null, console.error);
});

router.get('/add', function(req, res, next ){
    res.render("addproject");
});

router.get('/addidea', function(req, res, next ){
    res.render("addidea");
});

router.post('/upvote/:type', function(req, res, next) {
  var type = req.params.type; //collection to add to
  type = type.slice(0,1).toUpperCase() + type.slice(1);
  var data = req.body;
  mongoose.model(type).findOneAndUpdate({title: data.title}, {$inc: {upVotes: 1}} , {new: true})
  .then(function(project) {
    res.json({upVotes: project.upVotes});
  })
  //Can add the IP address of the vote so that it can't vote again
})


router.post('/add', function (req, res, next) {
  Project.create(req.body).then(function(project) {
    res.redirect('/');
    return project;
  }).then(function (project) {
    var options = {
      url: project.githubData,
      headers: {
      'User-Agent': 'sidelist'
      }
    };
    request(options, function (err, res, body) {
      if (!err) {
        var data = JSON.parse(body)
        Project.findOneAndUpdate({title: project.title}, {imgPath: data.avatar_url})
        .then(null, function(err) {
          console.log(err);
        })
      }
    })
  })
})


router.post('/addidea', function (req, res, next) {
  Idea.create(req.body).then(function(idea) {
    res.redirect('/');
  })
})

router.post('/saveavatar', function (req, res, next) {
  var url = req.body.url;
  var title = req.body.title;
  Project.findOneAndUpdate({title: title}, {imgPath: url}).then(function () {
    res.json({});
  })
})




module.exports = router;

