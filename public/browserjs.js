$(document).ready(function () {


  $('.thumbnail').on('click', '.upVoteButton', function () {
    $votes = $(this);
    var name = $votes.attr('data-name');
    var type = $votes.attr('data-type');
    $.post('/upvote/'+type, {title: name}, function(res) {
      $votes.html(res.upVotes+" <span class='glyphicon glyphicon-triangle-top' aria-hidden='true'></span>");
    })
    $(this).toggleClass('upVoteButton');
    $(this).toggleClass('upVoteButtonOff');
  })

  // $('.navbar-nav').on('click', 'a', function () {
  //   $(this).parent().toggleClass('active');
  // });
  
    $('.section-scroll span:nth-child(2)').on('click', function() {
      $('.side-list-project').animate({ scrollLeft: '+=855' }, 1000);
      // $('.side-list-project').scrollLeft(855);    
    });
    $('.section-scroll span:nth-child(1)').on('click', function() {
      $('.side-list-project').animate({ scrollLeft: '-=855' }, 1000);
    });

     $('.section-scroll-idea span:nth-child(2)').on('click', function() {
      $('.side-list-idea').animate({ scrollLeft: '+=855' }, 1000);
    });
    $('.section-scroll-idea span:nth-child(1)').on('click', function() {
      $('.side-list-idea').animate({ scrollLeft: '-=855' }, 1000);
    });

    //to be adjusted to be dynamic based on page width - scroll the right amount

    $('.user-pic').each(function() {
      var $button = $(this);
      var $img = $button.find('img');
      var userName = $button.data('user');
      if (userName.length > 3 && ($img.attr('src') < 3 || checkDataContentEmpty($button))) {
        $.get('https://api.github.com/users/' + userName, function(data) {
          console.log('github image fetched');
          $img.attr('src', data.avatar_url);
          var toPost = "<div class='popOverBox'><img src='"+ data.avatar_url + "' /></div>"
          console.log(toPost);
          console.log($button);
          var buttonData = $button.data();
          buttonData.content = toPost;
          $.post('/saveavatar', {url: data.avatar_url, title: $button.attr('title'), userName: data.name}, function (res) {
            console.log('img should be saved for ' + $button.attr('title') + ': ' + data.avatar_url);
          })
        })
      }
    });

    // $( ".user-pic" ).tooltip( "enable" );
    
      
    $('.user-pic').popover({
      'trigger':'hover',
      'html':true,
      'delay': { "show": 100, "hide": 400 }
    });    


    function checkDataContentEmpty (button) {
      var content = button.data('content')
      content.split('src=');
      if(content[1].slice(2,1) === ' ') {
        return true; 
      } else {
        return false;
      }
    }

    // $('.user-pic > img').popover('show')

});



