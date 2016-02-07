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
      console.log('clicked');
      $('.side-list-project').scrollLeft(855);    
    });
    $('.section-scroll span:nth-child(1)').on('click', function() {
      console.log('clicked');
      $('.side-list-project').scrollLeft(-855);    
    });

     $('.section-scroll-idea span:nth-child(2)').on('click', function() {
      console.log('clicked');
      $('.side-list-project').scrollLeft(855);    
    });
    $('.section-scroll-idea span:nth-child(1)').on('click', function() {
      console.log('clicked');
      $('.side-list-project').scrollLeft(-855);    
    });
});

