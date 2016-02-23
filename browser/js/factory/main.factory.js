app.factory('MainFactory', function($http, $firebaseArray, $firebaseObject, $firebaseAuth) {
    
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
    var url = 'https://sidehunt.firebaseio.com/';
    var user = $firebaseAuth(new Firebase("https://sidehunt.firebaseio.com/")).$getAuth();
    var upVoters = $firebaseArray(new Firebase(url+type+'/'+projectObj.$id+"/upVoters"))
    upVoters.$loaded().then((upVoters) => {
        upVoters.forEach(voter => {
          if (voter.$value === user.uid) {
            throw new Error('Already voted')
          }
        })
        return upVoters.$add(user.uid)

        // console.log(upVoters)

        // // console.log(upVoters[0].$value)
        // // console.log(upVoters.$indexFor(user.uid))
        // if (upVoters.$indexFor(user.uid) < 0) {
        //   return 
        // } else {
        //   throw Error
        // }
    })
    .then(() => {
      var ideaToAddUpVote = $firebaseObject(new Firebase(url+type+'/'+projectObj.$id))
      return ideaToAddUpVote
    })
    .then((idea) => {
        idea.$loaded().then(function() {
        idea.upVotes = projectObj.upVotes + 1;
        idea.$save()
      })
    })
    .catch(err => console.log(err))      
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



