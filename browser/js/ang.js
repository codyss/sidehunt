var app = angular.module('sidehunt', ['ui.router', 'ui.bootstrap']);

app.config(function($urlRouterProvider) {
  $urlRouterProvider.when('/', '/index')
})

app.config(function($locationProvider) {
  $locationProvider.html5Mode({enabled:true, requireBase:false})
})

app.config(function($stateProvider) {
  $stateProvider.state('index', {
    url: '/index',
    templateUrl: '/projectsList.html',
    controller: 'main',
    resolve: {
      data: function(MainFactory) {
        return MainFactory.getData();
      }
    }
  })
});


app.config(function($stateProvider) {
  $stateProvider.state('AddIdea', {
    url: '/add-idea',
    templateUrl: '/addidea.html',
    controller: 'Add'
  })
})


app.config(function($stateProvider) {
  $stateProvider.state('AddProject', {
    url: '/add',
    templateUrl: '/addproject.html',
    controller: 'Add'
  })
})


app.directive('projectDirective', function (MainFactory) {
  return {
    restrict: 'E',
    template: `        
        <img id="project_img" class="img-responsive" src="/github-octocat.png">
          <div class="caption"> <!-- GIVE THIS  A MAX SIZE -->
            <text id="thumb-project-name">{{project.title}}</text><br>
            <text id="thumb-project-user">By {{project.userName}}</text>
            <p>{{project.description}}</p>
            <p><a href="{{project.repo}}" class="btn btn-primary details-button" role="button">Repo</a> 
            <up-vote-button project="project" type="project" ng-click="upVote(project,'Project')"></up-vote-button>
            <a class="btn btn-primary user-pic" data-image="{{project.imgPath}}" data-user="{{project.githubName}}" data-title="{{project.userName}}" data-placement="top" role="button" title="{{project.userName}}" data-toggle="popover" data-trigger="click" data-content='<div class="popOverBox"><img src="{{project.imgPath}}" /></div>'><img src="{{project.imgPath}}"></a></p>
        </div>`,
    link: function($scope) {
      // $scope.projects = data.projects;
      angular.extend($scope, MainFactory)
      // $scope.upVote = MainFactory.upVote
    }

  }
})

app.directive('ideaDirective', function (MainFactory) {
  return {
    restrict: 'E',
    template: `        
        <img id="project_img" class="img-responsive" src="/github-octocat.png" alt="...">
              <div class="caption">
                <text id="thumb-idea-name">{{idea.title}}</text><br>
                <text id="thumb-idea-user">By {{idea.user.firstName}} {{idea.user.lastName}}</text>
                <p>{{idea.description}}</p>
                <p><a href="{{idea.route}}" class="btn btn-primary details-button" role="button">Details</a> 
                <up-vote-button idea="idea" type="idea" ng-click="upVote(idea,'Idea')"></up-vote-button>
                <a class="btn btn-primary user-pic" data-image="{{idea.imgPath}}" data-user="{{idea.githubName}}" data-title="{{idea.userName}}" data-placement="top" role="button" title="{{idea.userName}}" data-toggle="popover" data-trigger="click" data-content='<div class="popOverBox"><img src="{{idea.imgPath}}" /></div>'><img src="{{idea.imgPath}}"></a>
               <!--  <a href="" class="btn btn-primary details-button" role="button">{{Details}}</a> --></p>
              </div>`,
    link: function($scope) {
      // $scope.projects = data.projects;
      angular.extend($scope, MainFactory)
      // $scope.upVote = MainFactory.upVote
    }

  }
})

app.directive('upVoteButton', function () {
  return {
    restrict: 'E',
    scope: {
      item: '=',
      type: '='
    },
    template: `<button class="btn btn-default upVoteButton" data-type="idea" data-name="{{type.title}}">{{type.upVotes}} <span class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span></button>`
    }
  })

app.controller('main', function ($scope, MainFactory, data, $rootScope) {

  $scope.projects = data.projects;
  $scope.ideas = data.ideas;
  
  // $scope.upVote = MainFactory.upVote

  $scope.scrollRightProject = MainFactory.scrollRightProject;
  $scope.scrollRightIdea = MainFactory.scrollRightIdea;
  $scope.scrollLeftProject = MainFactory.scrollLeftProject;
  $scope.scrollLeftIdea = MainFactory.scrollLeftIdea;

  $scope.dynamicPopover = {
    content: "Hello, World!",
    templateUrl: "myPopoverTemplate.html",
    title: "Title"
  }

  $rootScope.showSearch = false;
})

app.controller('Add', function ($rootScope, $scope, AddFactory) {
  $rootScope.showSearch = true;

  $scope.addIdea = function () {
    AddFactory.addIdea($scope.githubNameModel, $scope.titleModel, $scope.descriptionModel);
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