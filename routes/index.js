var express = require('express');
var router = express.Router();
var bootstrapRouter = require('bootstrap-router');
var _ = require('lodash');

var models = require('../models/');


var User = require('../models').User;
var Idea = require('../models').Idea;
var Project = require('../models').Project;


//lodash random for getting a random chat ID


router.get('/', function(req, res, next ){
  Project.find({}).populate('user')
  .then(function(projects) {
    console.log(projects[0]);
    res.render("index", {
    projects: projects,
  });
  }).then(null, function (err) {
    console.log(err);
  });
});




router.get('/add', function(req, res, next ){
    res.render("addproject");
})


router.post('/add', function (req, res, next) {
  Project.create(req.body).then(function(project) {
    res.redirect('/');
  })
})





module.exports = router;

