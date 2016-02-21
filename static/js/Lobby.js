// Uses JQuery

function Lobby(socket, lobbyEl) {
  this.socket = socket;
  this.lobbyEl = lobbyEl;
  this.idPrefix = lobbyEl.attr('id');
}

Lobby.create = function(socket, lobbyEl) {
  return new Lobby(socket, lobbyEl);
}

Lobby.prototype.init = function() {
  this.generate();

  with (this) {
    socket.on('lobby-update', function(data) {
      update(data);
    });
  }
}

Lobby.prototype.generate = function() {
  with (this) {
    lobbyEl
      .append(
        $('<div>')
          .attr('id', idPrefix + '-rooms-container')
          .attr('class', idPrefix + '-sidebar')
          .text('Rooms')
          .append(
            $('<ul>').attr('id', idPrefix + '-rooms'))
          .append(
            $('<form>')
              .attr('id', idPrefix + '-create-form')
              .attr('class', idPrefix + '-form')
              .append(
                $('<input>')
                  .attr('id', idPrefix + '-create-input')
                  .attr('placeholder', 'Enter room name'))
              .append(
                $('<button>')
                  .attr('id', idPrefix + '-create-submit')
                  .attr('type', 'submit')
                  .text('Create'))
              .submit(function() {
                createRoom();
              }))
          .append(
            $('<form>')
              .attr('id', idPrefix + '-leave-form')
              .attr('class', idPrefix + '-form')
              .append(
                $('<button>')
                  .attr('id', idPrefix + '-leave-submit')
                  .attr('type', 'submit')
                  .text('Leave'))
              .submit(function() {
                leaveRoom();
              })))              
      .append(
        $('<div>')
          .attr('id', idPrefix + '-chat-container')
          .attr('class', idPrefix + '-middle')
          .text('Chat')
          .append(
            $('<div>').attr('id', idPrefix + '-chat')))
      .append(
        $('<div>')
          .attr('id', idPrefix + '-users-container')
          .attr('class', idPrefix + '-sidebar')
          .text('Users')
          .append(
            $('<ul>').attr('id', idPrefix + '-users')));
  }
}

Lobby.prototype.show = function() {
  this.lobbyEl.show();
}

Lobby.prototype.hide = function() {
  this.lobbyEl.hide();
}

Lobby.prototype.update = function(data) {
  var rooms = [];
  var freeUsers = [];

  with (this) {
    $.each(data.rooms, function(room, users) {
      rooms.push(
        $('<li>')
          .append(
            $('<span>')
              .attr('class', idPrefix + '-room-name')
              .text(room))
          .append(
            $('<span>')
              .attr('class', idPrefix + '-room-info')
              .text(users.length + "/" + Constants.ROOM_CAPACITY))
          .click(function() {
            joinRoom(room);
          }));
    });

    $.each(data.freeUsers, function(i, freeUser) {
      freeUsers.push($('<li>').text(freeUser));
    });

    $('#' + idPrefix + '-rooms').empty();
    $('#' + idPrefix + '-users').empty();    
    $('#' + idPrefix + '-rooms').append.apply($('#' + idPrefix + '-rooms'), rooms);
    $('#' + idPrefix + '-users').append.apply($('#' + idPrefix + '-users'), freeUsers);
  }
}

Lobby.prototype.createRoom = function() {
  with (this) {
    var room = $('#' + idPrefix + '-create-input').val();

    socket.emit('create-room', {
      room: room
    }, function(status) {
      enterRoom(status);
    });
  }

  return false;
}

Lobby.prototype.joinRoom = function(room) {
  with (this) {
    socket.emit('join-room', {
      room: room
    }, function(status) {
      console.log(status);
    });
  }

  return false;
}

Lobby.prototype.enterRoom = function(status) {
  console.log(status);
  if (status.success) {
    $('#' + this.idPrefix + '-create-form').hide();
    $('#' + this.idPrefix + '-leave-form').show();
  } else {
    window.alert(status.message);
  }

  return false;
}

Lobby.prototype.leaveRoom = function() {
  socket.emit('leave-room', {});
  $('#' + this.idPrefix + '-leave-form').hide();
  $('#' + this.idPrefix + '-create-form').show();
  return false;
}
