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
      var $img = $(this).find('img');
      var userName = $(this).data('user');
      // if (userName.length > 3 && $img.attr('src') < 3) {
      //   console.log($img.attr('src'));
      //   $.get('https://api.github.com/users/' + userName, function(data) {
      //     console.log('github image fetched');
      //     $img.attr('src', data.avatar_url);
      //     $.post('/saveavatar', {url: data.avatar_url, title: $img.data('title')}, function (res) {
      //       //
      //     })
      //   })

      // }
    });

    // $('.user-pic > img').popover('show')

});



