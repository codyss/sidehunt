var express = require('express');
var router = express.Router();
var bootstrapRouter = require('bootstrap-router');
var _ = require('lodash');

var models = require('../models/');

var Projects = models.Projects;


//lodash random for getting a random chat ID

module.exports = function(io){
  router.get('/', function(req, res){
    res.render("index");
  });
  return router;
};
