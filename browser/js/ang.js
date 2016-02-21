var app = angular.module('sidehunt', ['ui.router', 'ui.bootstrap', 'firebase']);

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

  $stateProvider.state('ideaDetail', {
    url: '/idea/:ideaId',
    templateUrl: '/projectstorm.html',
    controller: 'FireCtrl',
    resolve: {
      itemToShow: function(IdeaFactory, $stateParams) {
        return IdeaFactory.getIdea($stateParams.ideaId);
      }
    }
  })
});

app.config(function($stateProvider) {
  $stateProvider.state('githubstats', {
    url: '/githubstats',
    templateUrl: '/githubstats.html',
    controller: 'GitHubCtrl',
    resolve: {
      githubstats: function ($http) {
        return $http.get('api/gitstats').then(res => res.data)
      }
    }
  })
})



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

app.config(function($stateProvider) {
  $stateProvider.state('ProjectStorm', {
    url: '/project/:projectId',
    templateUrl: '/projectstorm.html',
    controller: 'FireCtrl',
    resolve: {
      itemToShow: function(MainFactory, $stateParams) {
        return MainFactory.getProject($stateParams.projectId)
      }
    }
  })
})


app.directive('projectDirective', function (MainFactory) {
  return {
    restrict: 'E',
    template: `        
        <img id="project_img" class="img-responsive" src="/github-octocat.png">
          <div class="caption"> <!-- GIVE THIS  A MAX SIZE -->
            <text id="thumb-project-name">{{project.title}}</text><br>
            <text id="thumb-project-user">{{project.userName}}</text>
            <p>{{project.description}}</p>
            <p><a href="{{project.repo}}" class="btn btn-primary details-button" role="button">Repo</a>
            <a href="project/{{project._id}}" class="btn btn-primary details-button" role="button">Discuss</a> 
            <up-vote-button project="project" type="project" ng-click="upVote(project,'Project', projects)"></up-vote-button>
            <a class="btn btn-primary user-pic" data-image="{{project.imgPath}}" data-user="{{project.githubName}}" data-title="{{project.userName}}" data-placement="top" role="button" title="{{project.userName}}" data-toggle="popover" data-trigger="click" data-content='<div class="popOverBox"><img src="{{project.imgPath}}" /></div>'><img src="{{project.imgPath}}"></a></p>
        </div>`,
    link: function($scope) {
      angular.extend($scope, MainFactory)
    }

  }
})

app.directive('ideaDirective', function (MainFactory) {
  return {
    restrict: 'E',
    template: `        
        <img id="project_img" class="img-responsive" src="/github-octocat.png">
              <div class="caption">
                <text id="thumb-idea-name">{{idea.title}}</text><br>
                <text id="thumb-idea-user">{{idea.userName}}</text>
                <p>{{idea.description}}</p>
                <p><a href="/idea/{{idea._id}}" class="btn btn-primary details-button" role="button">Details</a> 
                <up-vote-button idea="idea" type="idea" ng-click="upVote(idea,'Idea', ideas)"></up-vote-button>
                <a class="btn btn-primary user-pic" data-image="{{idea.imgPath}}" data-user="{{idea.githubName}}" data-title="{{idea.userName}}" data-placement="top" role="button" title="{{idea.userName}}" data-toggle="popover" data-trigger="click" data-content='<div class="popOverBox"><img src="{{idea.imgPath}}" /></div>'><img src="{{idea.imgPath}}"></a>
               <!--  <a href="" class="btn btn-primary details-button" role="button">{{Details}}</a> --></p>
              </div>`,
    link: function($scope) {
      angular.extend($scope, MainFactory)
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
  
  $scope.scrollRightProject = MainFactory.scrollRightProject;
  $scope.scrollRightIdea = MainFactory.scrollRightIdea;
  $scope.scrollLeftProject = MainFactory.scrollLeftProject;
  $scope.scrollLeftIdea = MainFactory.scrollLeftIdea; 


  $rootScope.showSearch = false;
})

app.controller('Add', function ($rootScope, $scope, AddFactory) {
  $rootScope.showSearch = true;

  $scope.addIdea = function () {
    AddFactory.addIdea($scope.githubNameModel, $scope.titleModel, $scope.descriptionModel);
  }
  
})

app.controller('GitHubCtrl', function($scope, $http) {
  $scope.getStudentStats = function () {
    $http.get('/api/studentstats')
      .then(res => res.data)
      .then(students => {
        console.log(students);
        $scope.studentStats = students
        generatePlot();
      }).then(null, console.error)
  }

  function generatePlot () {
    data = {};
    data.x = $scope.studentStats.map(std => {
      return std.student
    })
    data.y = $scope.studentStats.map(std => {
      return std.stats[0].slice(0,3)
    })
    data.type = 'bar'
    Plotly.newPlot('myDiv', [data]);

  }
})


app.controller('FireCtrl', function($scope, $firebaseArray, $firebaseObject, $stateParams, itemToShow, MainFactory) {
  $scope.project = itemToShow;
  var project = $stateParams.projectId;
  var url = 'https://sidehunt.firebaseio.com/projectcomments/'+project;
  var projectCommentsRef = new Firebase(url)
  $scope.storm = $firebaseArray(projectCommentsRef);

  $scope.commentToAdd = {};
  angular.extend($scope, MainFactory)

  //figure out how to save the comment on the project
  $scope.like = function (comment) {
    var newUrl = url+'/'+comment.$id+'/likes'
    var obj = $firebaseObject(new Firebase(newUrl))
    obj.$value = comment.likes+1
    obj.$save();
  } 

  $scope.addComment = function () {
    $scope.storm.$add({
      text: $scope.commentToAdd.text,
      timestamp: Firebase.ServerValue.TIMESTAMP,
      likes: 0
    })

    $scope.commentToAdd.text = '';

  }
})