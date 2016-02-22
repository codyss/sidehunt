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
      ideas: function($firebaseArray) {
        return $firebaseArray(new Firebase('https://sidehunt.firebaseio.com/idea'))
      },
      projects: function($firebaseArray) {
        return $firebaseArray(new Firebase('https://sidehunt.firebaseio.com/project'))
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
    url: '/detail/:type/:projectId',
    templateUrl: '/projectstorm.html',
    controller: 'FireCtrl',
    resolve: {
      itemToShow: function($firebaseObject, $stateParams) {
        return $firebaseObject(new Firebase('https://sidehunt.firebaseio.com/'+$stateParams.type+'/'+$stateParams.projectId)).$loaded()
      }
    }
  })
})


app.directive('projectDirective', function (MainFactory) {
  return {
    restrict: 'E',
    template: `        
        <img id="project_img" class="img-responsive" src="/imgs/github-octocat.png">
          <div class="caption"> <!-- GIVE THIS  A MAX SIZE -->
            <text id="thumb-project-name">{{project.title}}</text><br>
            <text id="thumb-project-user">{{project.user.displayName}}</text>
            <p>{{project.description}}</p>
            <p><a href="{{project.repo}}" class="btn btn-primary details-button" role="button">Repo</a>
            <a href="detail/project/{{project.$id}}" class="btn btn-primary details-button" role="button">Discuss</a> 
            <up-vote-button project="project" type="project" ng-click="upVote(project,'project', projects)"></up-vote-button>
            <a class="btn btn-primary user-pic" data-image="{{project.imgPath}}" data-user="{{project.githubName}}" data-title="{{project.userName}}" data-placement="top" role="button" title="{{project.userName}}" data-toggle="popover" data-trigger="click" data-content='<div class="popOverBox"><img src="{{project.imgPath}}" /></div>'><img src="{{project.user.profileImageURL}}"></a></p>
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
        <img id="project_img" class="img-responsive" src="imgs/github-octocat.png">
              <div class="caption">
                <text id="thumb-idea-name">{{idea.title}}</text><br>
                <text id="thumb-idea-user">{{idea.user.displayName}}</text>
                <p>{{idea.description}}</p>
                <p><a href="detail/idea/{{idea.$id}}" class="btn btn-primary details-button" role="button">Details</a> 
                <up-vote-button idea="idea" type="idea" ng-click="upVote(idea,'idea', ideas)"></up-vote-button>
                <a class="btn btn-primary user-pic" data-image="{{idea.imgPath}}" data-user="{{idea.githubName}}" data-title="{{idea.userName}}" data-placement="top" role="button" title="{{idea.userName}}" data-toggle="popover" data-trigger="click" data-content='<div class="popOverBox"><img src="{{idea.imgPath}}" /></div>'><img src="{{idea.user.profileImageURL}}"></a>
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

app.controller('main', function ($scope, MainFactory, ideas, projects, $rootScope, $firebaseAuth) {
  $scope.projects = projects;
  $scope.ideas = ideas;

  var ref = new Firebase("https://sidehunt.firebaseio.com/");
  $scope.authObj = $firebaseAuth(ref);
  $scope.user = $scope.authObj.$getAuth();

  $scope.logIn = function () {
    $scope.authObj.$authWithOAuthPopup("github").then(function(authData) {
      // console.log("Logged in as:", authData.uid);
    }).catch(function(error) {
      // console.error("Authentication failed:", error);
    });  

    $scope.user = $scope.authObj.$getAuth();
  }

  
  $scope.scrollRightProject = MainFactory.scrollRightProject;
  $scope.scrollRightIdea = MainFactory.scrollRightIdea;
  $scope.scrollLeftProject = MainFactory.scrollLeftProject;
  $scope.scrollLeftIdea = MainFactory.scrollLeftIdea; 


  $rootScope.showSearch = false;
})

app.controller('Add', function ($rootScope, $scope, AddFactory, $firebaseArray, $state, $firebaseAuth) {
  $rootScope.showSearch = true;
  angular.extend($scope, AddFactory)

  //firebase authentication
  $scope.authObj = $firebaseAuth(new Firebase("https://sidehunt.firebaseio.com/"));
  var authData = $scope.authObj.$getAuth();

  var url = 'https://sidehunt.firebaseio.com/';
  

  $scope.addNewIdea = function () {
    $scope.ideaToAdd = $firebaseArray(new Firebase(url+'idea'))
    $scope.ideaToAdd.$add({
      type: 'idea',
      title: $scope.titleModel,
      description: $scope.descriptionModel,
      upVotes: 0,
      user: authData.github
    })
    $state.go('index');
  }


  $scope.addNewProject = function () {
    $scope.githubName = AddFactory.nameFromRepo($scope.githubRepo)[0]
    $scope.projectToAdd = $firebaseArray(new Firebase(url+'project'))
    $scope.projectToAdd.$add({
      githubName: $scope.githubName,
      title: $scope.title,
      type: 'project',
      description: $scope.description,
      repo: $scope.githubRepo,
      githubData: "",
      upVotes: 0,
      user: authData.github,
      websiteImg: "",
      imgPath: "",
      upVotes: 0,
      upVoters: "",
      comments: []
    })
    $state.go('index');
  }

  

  // $scope.addIdea = function () {
  //   AddFactory.addIdea($scope.githubNameModel, $scope.titleModel, $scope.descriptionModel);
  // }
  
})

app.controller('GitHubCtrl', function($scope, $http, githubstats) {
  $scope.studentStats = githubstats;
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


app.controller('FireCtrl', function($scope, $firebaseArray, $firebaseObject, $stateParams, itemToShow, MainFactory, $firebaseAuth) {
  $scope.project = itemToShow;
  $scope.type = $stateParams.type
  var projectId = $stateParams.projectId;
  var url = 'https://sidehunt.firebaseio.com/'+$stateParams.type+'/'+projectId+'/comments';
  var projectCommentsRef = new Firebase(url)
  $scope.storm = $firebaseArray(projectCommentsRef);

  //firebase authentication
  $scope.authObj = $firebaseAuth(new Firebase("https://sidehunt.firebaseio.com/"));
  // var authData = $scope.authObj.$getAuth();
  $scope.user = $scope.authObj.$getAuth();

  $scope.commentToAdd = {};
  angular.extend($scope, MainFactory)

  $scope.like = function (comment) {
    var obj = $firebaseObject(new Firebase(url+'/'+comment.$id));
    obj.$loaded().then(() => {
      obj.likes = comment.likes+1
      obj.$save();
    })
  } 

  $scope.removeComment = function (comment) {
    if(comment.user.id === $scope.user.github.id) {
      $scope.storm.$remove(comment)  
    }    
  }

  $scope.addComment = function () {
    $scope.storm.$add({
      text: $scope.commentToAdd.text,
      timestamp: Firebase.ServerValue.TIMESTAMP,
      likes: 0,
      user: $scope.user.github
    })

    $scope.commentToAdd.text = '';

  }
})