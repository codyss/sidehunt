app.factory('IdeaFactory', function ($http) {
  var IdeaFactory = {};

  IdeaFactory.getIdea = function (id) {
    return $http.get('/api/idea/' + id).then(res => res.data);
  }




  return IdeaFactory;
})
