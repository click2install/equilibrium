var socket = io();
//var game = Game.create(socket, document.getElementById('canvas'));

$('document').ready(function() {
  console.log("test");
  $('#name-input').focus();

  function send_name() {
    var name = $('#name-input').val();
    console.log(name);
    
    socket.emit('new-player', {
      name: name
    });

    $('#name-container').hide();
    $('#lobby').show();

    return false;
  }
  
  $('#name-form').submit(send_name);
  $('#name-submit').click(send_name);

  socket.on('lobby-update', function(data) {
    console.log(data);
    
    $('#lobby-rooms').empty();
    $('#lobby-users').empty();

    var rooms = []
    var freeUsers = []

    $(data.rooms).each(function(name, room) {
      rooms.push($('<li>').text(name + '&nbsp;&nbsp;&nbsp;&nbsp;'));          
    });

    $(data.freeUsers).each(function(i, freeUser) {
      freeUsers.push($('<li>').text(freeUser));
    });

    $('#lobby-rooms').append.apply($('#lobby-rooms'), rooms);
    $('#lobby-users').append.apply($('#lobby-users'), freeUsers);
  });
});
