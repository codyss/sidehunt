app.factory('IdeaFactory', function ($http) {
  var IdeaFactory = {};

  IdeaFactory.getIdea = function (id) {
    return $http.get('/api/idea/' + id)
    .then(res => res.data)
    .catch(console.error);
  }

  IdeaFactory.getComments = function(id) {
    return $http.get('/api/idea/comments/' + id)
      .then(res => res.data);
  }

  IdeaFactory.addComment = function (ideaId, text) {
    return $http.post('/api/idea/addcomment', {ideaId: ideaId, text: text})
  }
  
  return IdeaFactory;
})
