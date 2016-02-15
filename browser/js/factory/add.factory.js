app.factory('AddFactory', function($http, $state) {
    
  var AddFactory = {};

  AddFactory.addIdea = function (githubName, title, description) {
    $http.post('/api/addidea', {githubName: githubName, title: title, description: description});
    $state.go('index');
  }

  // MainFactory.getData = function () {
  //   return $http.get('/api')
  //   .then(obj => obj.data)
  //   .catch(console.error.bind(console));
  // }


  // MainFactory.upVote = function (projectObj, type) {
  //   $http.post('/upvote/'+ type, {id: projectObj._id})
  //   .then(function (res) {
  //     projectObj.upVotes = res.data.upVotes;
  //   })
  // }

  return AddFactory;

})


