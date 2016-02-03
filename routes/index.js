var express = require('express');
var router = express.Router();
var bootstrapRouter = require('bootstrap-router');
var _ = require('lodash');
var Promise = require('bluebird');

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




router.get('/add', function(req, res, next ){
    res.render("addproject");
})

router.get('/addidea', function(req, res, next ){
    res.render("addidea");
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

