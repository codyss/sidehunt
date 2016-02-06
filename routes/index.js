var express = require('express');
var router = express.Router();
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
  Promise.all([
     Project.find({}).populate('user'),
     Idea.find({}).populate('user')
    ])
  .spread(function (projects, ideas) {
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
})


router.post('/add', function (req, res, next) {
  Project.create(req.body).then(function(project) {
    res.redirect('/');
  })
})


router.post('/addidea', function (req, res, next) {
  Idea.create(req.body).then(function(idea) {
    res.redirect('/');
  })
})





module.exports = router;

