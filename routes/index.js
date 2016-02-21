var express = require('express');
var router = express.Router();
var request = require('request');
var bootstrapRouter = require('bootstrap-router');
var _ = require('lodash');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var webshot = require('webshot');
var path = require('path');
var models = require('../models/');
var sjs = require('scraperjs/src/Scraper');



var User = require('../models').User;
var Idea = require('../models').Idea;
var Project = require('../models').Project;
var Comment = require('../models').Comment;



router.get('/api', function(req, res, next ){
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
        res.json({
        projects: projects,
        ideas: ideas
      });
    })
    .then(null, function (err) {
    console.log(err);
  });
});


router.get('/api/idea/:id', function (req, res, next) {
  Idea.findOne({_id: req.params.id})
  .then(function(idea) {
    res.json(idea);
  }).then(null, console.error);
});

router.get('/api/idea/comments/:id', function (req, res, next) {
  Comment.find({idea: req.params.id})
    .then(ideas=> res.json(ideas))
    .then(null, console.error)
})


router.post('/api/idea/addcomment', function (req, res, next) {
  Comment.create({
    text: req.body.text,
    idea: req.body.ideaId
  })
  .then(comment => {
    res.json(comment);
    console.log(comment);
  })
  .then(null, err=> console.log(err))
})

router.get('/api/projects/:id', function (req, res, next) {
    Project.findOne({_id: req.params.id})
    .then(function(project) {
      res.json(project);
    })
    .then(null, console.error);
})

var githubStats = {};

router.get('/api/gitstats', function (req, res, next) {
    var url = 'https://github.com/';
    var students = ['codyss', 'apackin', 'jmeeke02'];
    var studentsArr = students;
    var userUrls = [];

    (function runStudents () {
      sjs.StaticScraper
        .create(url + students[0])
        .scrape(function($) {
            return $('.contrib-number').map(function() {
                return $(this).text();
            }).get()
        })
        .then(function(stats) {
          githubStats[students[0]] = stats;
          console.log(stats);
          students.shift();
          if(students.length>0) runStudents();
        })
    })()
})

router.get('/api/studentstats', function (req, res, next) {
  res.json(githubStats);
})


router.get('/*', function(req, res, next ){
  res.sendFile(path.join(__dirname, '../browser/index.html'));
});






router.get('/add', function(req, res, next ){
    res.sendFile(path.join(__dirname, '../views/addproject.html'));
});

router.get('/addidea', function(req, res, next ){
    res.render("addidea");
});

router.post('/upvote/:type', function(req, res, next) {
  var type = req.params.type; //collection to add to
  var data = req.body;
  mongoose.model(type).findByIdAndUpdate(data.id, {$inc: {upVotes: 1}} , {new: true})
  .then(function(project) {
    res.json({upVotes: project.upVotes});
  })
  //Can add the IP address of the vote so that it can't vote again
})


router.post('/add', function (req, res, next) {
  Project.create(req.body).then(function(project) {
    res.redirect('/');
    return project;
  })
  .then(function (project) {
    var options = {
      url: project.githubData,
      headers: {
      'User-Agent': 'sidelist'
      }
    };
    request(options, function (err, res, body) {
      if (!err) {
        var data = JSON.parse(body);
        if (!data.name) {
          data.name = data.login;
        }
        Project.findOneAndUpdate({title: project.title}, {imgPath: data.avatar_url, userName: data.name})
        .then(null, function(err) {
          console.log(err);
        })
      }
    })
  })
})



router.post('/api/addidea', function (req, res, next) {
  Idea.create(req.body).then(function(idea) {
    var options = {
      url: 'https://api.github.com/users/' + idea.githubName,
      headers: {
        'User-Agent': 'sidelist'
      }
    };
    request(options, function (err, res, body) {
      if(!err) {
        var data = JSON.parse(body);
        if (!data.name) {
          data.name = data.login;
        }
        Idea.findOneAndUpdate({title:idea.title}, {imgPath: data.avatar_url, userName: data.name})
        .then(null, function (err) {
          console.log(err);
        })
      }
    })
  })
})

router.post('/saveavatar', function (req, res, next) {
  Project.findOneAndUpdate({title: req.body.title}, {imgPath: req.body.url, userName: req.body.userName}).then(function () {
    res.json({});
  })
})




module.exports = router;

