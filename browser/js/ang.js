var app = angular.module('sidehunt', ['ui.router']);

  app.config(function($stateProvider) {
    $stateProvider.state('projects', {
      url: '/app',
      templateUrl: '/projectsList.html',
      controller: 'sidehuntC'
    })
  });


app.controller('sidehuntC', function ($scope, $http, $log) {
  $http.get('/api').then(function(obj) {
    $scope.projects = obj.data.projects;
    $scope.ideas = obj.data.ideas;
    console.log.bind(console, obj.data);
  }).catch(console.error.bind(console));

  
  $scope.add = function (projectObj, type) {
    $log.log('clicked');
    $http.post('/upvote/'+ type, {id: projectObj._id})
    .then(function (res) {
      projectObj.upVotes = res.data.upVotes;
    })
  }




})



  // $('.thumbnail').on('click', '.upVoteButton', function () {
  //   $votes = $(this);
  //   var name = $votes.attr('data-name');
  //   var type = $votes.attr('data-type');
  //   $.post('/upvote/'+type, {title: name}, function(res) {
  //     $votes.html(res.upVotes+" <span class='glyphicon glyphicon-triangle-top' aria-hidden='true'></span>");
  //   })
  //   $(this).toggleClass('upVoteButton');
  //   $(this).toggleClass('upVoteButtonOff');
  // })