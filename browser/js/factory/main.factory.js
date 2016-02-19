app.factory('MainFactory', function($http) {
    
  var MainFactory = {};

  MainFactory.getData = function () {
    return $http.get('/api')
    .then(obj => obj.data)
    .catch(console.error);
  }

  MainFactory.getProject = function (id) {
    return $http.get('/api/projects/' + id)
    .then(project => project.data)
    .catch(console.error)
  }


  MainFactory.upVote = function (projectObj, type, projects) {
    $http.post('/upvote/'+ type, {id: projectObj._id})
    .then(function (res) {
      projectObj.upVotes = res.data.upVotes;
      projects.sort(function(a, b) {
        return b.upVotes - a.upVotes;
      })
    })
  }

  MainFactory.scrollRightProject = function () {
    $('.side-list-project').animate({ scrollLeft: '+=855' }, 1000);
  }

  MainFactory.scrollRightIdea = function () {
    $('.side-list-idea').animate({ scrollLeft: '+=855' }, 1000);
  }

  MainFactory.scrollLeftProject = function () {
    $('.side-list-project').animate({ scrollLeft: '-=855' }, 1000);
  }

  MainFactory.scrollLeftIdea = function () {
    $('.side-list-idea').animate({ scrollLeft: '-=855' }, 1000);;
  }

  return MainFactory;




})



