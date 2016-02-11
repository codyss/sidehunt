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


var User = require('../models').User;
var Idea = require('../models').Idea;
var Project = require('../models').Project;


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


router.get('/', function(req, res, next ){
  //Make side hunt the first project all the time
  // Promise.all([
  //    Project.find({}).populate('user'),
  //    Idea.find({}).populate('user')
  //   ])
  // .spread(function (projects, ideas) {
  //     projects.sort(function (a, b) {
  //       return a.upVotes - b.upVotes;
  //     });
  //     projects.reverse();
  //     ideas.sort(function (a, b) {
  //       return a.upVotes - b.upVotes;
  //     });
  //     ideas.reverse();
      res.sendFile(path.join(__dirname, '../views/index.html'));
      res.redirect('/#/')
    // })
  //   .then(null, function (err) {
  //   console.log(err);
  // });
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
  // .then(function(project) {
  //   webUrl = req.body.website;
  //   if (webUrl.length > 3) {
  //     webshot(webUrl, '../public/webimg/' + project.urlTitle + '_img.png', function(err) {
  //       // screenshot now saved to (title)_img.png in public/webimg/ folder
  //       console.error(err);
  //     });
  //   }
  //   return project;
  // })
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


router.post('/addidea', function (req, res, next) {
  Idea.create(req.body).then(function(idea) {
    res.redirect('/');
  })
})

router.post('/saveavatar', function (req, res, next) {
  Project.findOneAndUpdate({title: req.body.title}, {imgPath: req.body.url, userName: req.body.userName}).then(function () {
    res.json({});
  })
})




module.exports = router;

