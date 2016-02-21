var socket = io();
//var game = Game.create(socket, document.getElementById('canvas'));

var x;

$('document').ready(function() {
  $('#lobby').hide();
  $('#name-input').focus();

  $('#name-form').submit(function() {
    var name = $('#name-input').val();
    
    socket.emit('new-player', {
      name: name
    });

    $('#name-container').hide();
    $('#lobby').show();
    $('#lobby-leave-form').hide();

    return false;
  });

  socket.on('lobby-update', function(data) {
    x = data;

    var rooms = []
    var freeUsers = []

    $.each(data.rooms, function(room, users) {
      rooms.push(
        $('<li>')
          .append(
            $('<span>')
              .attr('class', 'lobby-room-name')
              .text(room)
              .click(function() {
                socket.emit('join-room', {
                  room: room
                });
              }))
          .append(
            $('<span>')
              .attr('class', 'lobby-room-info')
              .text(users.length + "/" + Constants.ROOM_CAPACITY)));
    });

    $.each(data.freeUsers, function(i, freeUser) {
      freeUsers.push($('<li>').text(freeUser));
    });

    $('#lobby-rooms').empty();
    $('#lobby-users').empty();    
    $('#lobby-rooms').append.apply($('#lobby-rooms'), rooms);
    $('#lobby-users').append.apply($('#lobby-users'), freeUsers);
  });

  $('#lobby-create-form').submit(function() {
    var room = $('#lobby-create-input').val();

    socket.emit('create-room', {
      room: room
    });

    $('#lobby-create-form').hide();
    $('#lobby-leave-form').show();
    
    return false;
  });

  $('#lobby-leave-form').submit(function() {
    socket.emit('leave-room', {});

    $('#lobby-leave-form').hide();
    $('#lobby-create-form').show();

    return false;
  });
});
