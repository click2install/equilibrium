// Uses JQuery

function Lobby(socket, lobbyEl) {
  this.socket = socket;
  this.lobbyEl = lobbyEl;
  this.currentRoom = '';
}

var x;

Lobby.create = function(socket, lobbyEl) {
  return new Lobby(socket, lobbyEl);
}

Lobby.prototype.init = function() {
  this.generate();
  $('#lobby-current-room-container').hide();
  
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
          .attr('id', 'lobby-rooms-container')
          .attr('class', 'lobby-sidebar')
          .append(
            $('<div>')
              .attr('id', 'lobby-rooms-title')
              .text('Rooms'))
          .append(
            $('<ul>').attr('id', 'lobby-rooms'))
          .append(
            $('<form>')
              .attr('id', 'lobby-create-form')
              .attr('class', 'lobby-form')
              .append(
                $('<input>')
                  .attr('id', 'lobby-create-input')
                  .attr('placeholder', 'Enter room name'))
              .append(
                $('<button>')
                  .attr('id', 'lobby-create-submit')
                  .attr('type', 'submit')
                  .text('Create'))
              .submit(function(event) {
                event.preventDefault();
                createRoom();
              })))
      .append(
        $('<div>')
          .attr('id', 'lobby-current-room-container')
          .attr('class', 'lobby-sidebar')
          .append(
            $('<div>')
              .attr('id', 'lobby-current-room-title')
              .text('Room'))
          .append(
            $('<ul>').attr('id', 'lobby-current-room-users'))
          .append(
            $('<form>')
              .attr('id', 'lobby-leave-form')
              .attr('class', 'lobby-form')
              .append(
                $('<button>')
                  .attr('id', 'lobby-leave-submit')
                  .attr('type', 'submit')
                  .text('Leave'))
              .submit(function(event) {
                event.preventDefault();
                leaveRoom();
              })))
      .append(
        $('<div>')
          .attr('id', 'lobby-chat-container')
          .attr('class', 'lobby-middle')
          .append(
            $('<div>')
              .attr('id', 'lobby-chat-title')
              .text('Chat'))
          .append(
            $('<div>').attr('id', 'lobby-chat')))
      .append(
        $('<div>')
          .attr('id', 'lobby-users-container')
          .attr('class', 'lobby-sidebar')
          .append(
            $('<div>')
              .attr('id', 'lobby-users-title')
              .text('Users'))
          .append(
            $('<ul>').attr('id', 'lobby-users')));
  }
}

Lobby.prototype.show = function() {
  this.lobbyEl.show();
}

Lobby.prototype.hide = function() {
  this.lobbyEl.hide();
}

Lobby.prototype.update = function(data) {
  with (this) {
    x = data;
    if (currentRoom == '') {
      var rooms = [];
      
      $.each(data.rooms, function(room, users) {
        rooms.push(
          $('<li>')
            .append(
              $('<span>')
                .attr('class', 'lobby-room-name')
                .text(room))
            .append(
              $('<span>')
                .attr('class', 'lobby-room-info')
                .text(users.length + "/" + Constants.ROOM_CAPACITY))
            .click(function() {
              event.preventDefault();
              joinRoom(room);
            }));
      });

      $('#lobby-rooms').empty();
      $('#lobby-rooms').append.apply($('#lobby-rooms'), rooms);
    } else {
      var users = [];

      $.each(data.rooms[currentRoom], function(i, user) {
        users.push(
          $('<li>')
            .append(
              $('<span>')
                .attr('class', 'lobby-current-room-user-name')
                .text(user.user))
            .append(
              $('<span>')
                .attr('class', 'lobby-current-room-user-ready')
                .text(user.readyState)));
      });

      $('#lobby-current-room-users').empty();
      $('#lobby-current-room-users').append.apply($('#lobby-current-room-users'), users);
    }

    var freeUsers = [];
    
    $.each(data.freeUsers, function(i, freeUser) {
      freeUsers.push($('<li>').text(freeUser));
    });

    $('#lobby-users').empty();
    $('#lobby-users').append.apply($('#lobby-users'), freeUsers);
  }
}

Lobby.prototype.createRoom = function() {
  with (this) {
    var room = $('#lobby-create-input').val();

    socket.emit('create-room', {
      room: room
    }, function(status) {
      if (status.success) {
        enterRoom(room);
      } else {
        window.alert(status.message);
      }
    });
  }
}

Lobby.prototype.joinRoom = function(room) {
  with (this) {
    socket.emit('join-room', {
      room: room
    }, function(status) {
      if (status.success) {
        enterRoom(room);
      } else {
        window.alert(status.message);
      }
    });
  }
}

Lobby.prototype.enterRoom = function(room) {
  $('#lobby-rooms-container').hide();
  $('#lobby-current-room-title').text('Room ' + room);
  $('#lobby-current-room-container').show();
  this.currentRoom = room;
}

Lobby.prototype.leaveRoom = function() {
  socket.emit('leave-room', {});
  $('#lobby-current-room-container').hide();
  $('#lobby-rooms-container').show();
  this.currentRoom = '';
}
