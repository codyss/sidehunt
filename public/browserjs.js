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

    //to be adjusted to be dynamic


    // Find the right repo github name to then do a get request on the image, do it on each image
    // potential to save the link to the repo in a data attribute for the button

});

$('.user-pic').each(function() {
  var $img = $(this).find('img');
  var userName = $(this).data('user');
  $.get('https://api.github.com/users/' + userName, function(data) {
    $img.attr('src', data.avatar_url);  
  })
});

// $.get('https://api.github.com/users/codyss', function(data) {
//   $('#user-pic > img').attr('src', data.avatar_url);
//   console.log(data.avatar_url);
// });

