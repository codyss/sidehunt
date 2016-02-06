$(document).ready(function () {

  $('.thumbnail').on('click', '.upVoteButton', function () {
    var name = $(this).attr('data-name');
    var type = $(this).attr('data-type');
    $votes = $(this);
    $.post('/upvote/'+type, {title: name}, function(res) {
      $votes.html(res.upVotes+" <span class='glyphicon glyphicon-triangle-top' aria-hidden='true'></span>");
    })
  })

})

