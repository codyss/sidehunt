app.factory('MainFactory', function($http) {
    
  var MainFactory = {};

  MainFactory.getData = function () {
    return $http.get('/api')
    .then(obj => obj.data)
    .catch(console.error.bind(console));
  }


  MainFactory.add = function (projectObj, type) {
    $http.post('/upvote/'+ type, {id: projectObj._id})
    .then(function (res) {
      projectObj.upVotes = res.data.upVotes;
    })
  }

  return MainFactory;

})