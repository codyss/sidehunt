app.factory('MainFactory', function($http) {
    
  var MainFactory = {};

  MainFactory.getData = function () {
    return $http.get('/api')
    .then(obj => obj.data)
    .catch(console.error.bind(console));
  }


  MainFactory.upVote = function (projectObj, type) {
    console.log(projectObj);
    $http.post('/upvote/'+ type, {id: projectObj._id})
    .then(function (res) {
      projectObj.upVotes = res.data.upVotes;
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



