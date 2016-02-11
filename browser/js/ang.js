var app = angular.module('sidehunt', ['ui.router']);

app.config(function($urlRouterProvider) {
  $urlRouterProvider.when('', '/index')
})

app.config(function($stateProvider) {
  $stateProvider.state('index', {
    url: '/index',
    templateUrl: '/projectsList.html',
    controller: 'main'
  })
});


app.config(function($stateProvider) {
  $stateProvider.state('addProject', {
    url: '/add',
    templateUrl: '',
    controller: 'addProject'
  })
})


app.controller('main', function ($scope, MainFactory) {

  MainFactory.getData()
  .then(data=> {
    $scope.projects = data.projects;
    $scope.ideas = data.ideas;
  });
  
  $scope.add = MainFactory.add

})

app.controller('addProject', function ($scope) {

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