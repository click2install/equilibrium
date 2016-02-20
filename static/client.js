var socket = io();
//var game = Game.create(socket, document.getElementById('canvas'));

var x;

$('document').ready(function() {
  $('#lobby').hide();
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
    x = data;
    $('#lobby-rooms').empty();
    $('#lobby-users').empty();

    var rooms = []
    var freeUsers = []

    $.each(data.rooms, function(name, users) {
      rooms.push(
        $('<li>')
          .append($('<div>').text(name))
          .append($('<div>').text(users.length + "/" + Constants.ROOM_CAPACITY)));
    });

    $.each(data.freeUsers, function(i, freeUser) {
      freeUsers.push($('<li>').text(freeUser));
    });

    $('#lobby-rooms').append.apply($('#lobby-rooms'), rooms);
    $('#lobby-users').append.apply($('#lobby-users'), freeUsers);
  });
});
