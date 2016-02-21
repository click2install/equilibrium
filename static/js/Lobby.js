// Uses JQuery

function Lobby(socket, lobbyEl) {
  this.socket = socket;
  this.lobbyEl = lobbyEl;
  this.currentRoom = '';
  this.ready = false;
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
    socket.on('chat-server-to-client', function(data) {
      receiveMessage(data);
    });
  }
}

Lobby.prototype.generate = function() {
  with (this) {
    lobbyEl
      .append(
        $('<div>')
          .prop('id', 'lobby-rooms-container')
          .prop('class', 'lobby-sidebar')
          .append(
            $('<div>')
              .prop('id', 'lobby-rooms-title')
              .prop('class', 'lobby-title')
              .text('Rooms'))
          .append(
            $('<ul>')
              .prop('id', 'lobby-rooms')
              .prop('class', 'lobby-content'))
          .append(
            $('<form>')
              .prop('id', 'lobby-create-form')
              .prop('class', 'lobby-form')
              .append(
                $('<input>')
                  .prop('id', 'lobby-create-input')
                  .prop('placeholder', 'Enter room name'))
              .append(
                $('<button>')
                  .prop('id', 'lobby-create-submit')
                  .prop('type', 'submit')
                  .text('Create'))
              .submit(function(event) {
                event.preventDefault();
                createRoom();
              })))
      .append(
        $('<div>')
          .prop('id', 'lobby-current-room-container')
          .prop('class', 'lobby-sidebar')
          .append(
            $('<div>')
              .prop('id', 'lobby-current-room-title')
              .prop('class', 'lobby-title')
              .text('Room'))
          .append(
            $('<ul>')
              .prop('id', 'lobby-current-room-users')
              .prop('class', 'lobby-content'))
          .append(
            $('<form>')
              .prop('id', 'lobby-ready-form')
              .prop('class', 'lobby-form')
              .append(
                $('<button>')
                  .prop('id', 'lobby-ready-submit')
                  .prop('type', 'submit')
                  .text(ready ? 'Unready' : 'Ready'))
              .submit(function(event) {
                event.preventDefault();
                toggleReady();
              }))
          .append(
            $('<form>')
              .prop('id', 'lobby-leave-form')
              .prop('class', 'lobby-form')
              .append(
                $('<button>')
                  .prop('id', 'lobby-leave-submit')
                  .prop('type', 'submit')
                  .text('Leave'))
              .submit(function(event) {
                event.preventDefault();
                leaveRoom();
              })))
      .append(
        $('<div>')
          .prop('id', 'lobby-chat-container')
          .prop('class', 'lobby-middle')
          .append(
            $('<div>')
              .prop('id', 'lobby-chat-title')
              .prop('class', 'lobby-title')
              .text('Chat'))
          .append(
            $('<textarea>')
              .prop('id', 'lobby-chat-history')
              .prop('class', 'lobby-content')
              .prop('readonly', true))
          .append(
            $('<form>')
              .prop('id', 'lobby-chat-form')
              .prop('class', 'lobby-form')
              .append(
                $('<input>')
                  .prop('id', 'lobby-chat-input')
                  .prop('placeholder', 'Enter message here'))
              .append(
                $('<button>')
                  .prop('id', 'lobby-chat-submit')
                  .prop('type', 'submit')
                  .text('Send'))
              .submit(function(event) {
                event.preventDefault();
                sendMessage();
              })))
      .append(
        $('<div>')
          .prop('id', 'lobby-users-container')
          .prop('class', 'lobby-sidebar')
          .append(
            $('<div>')
              .prop('id', 'lobby-users-title')
              .prop('class', 'lobby-title')
              .text('Users'))
          .append(
            $('<ul>')
              .prop('id', 'lobby-users')
              .prop('class', 'lobby-content')));
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
                .prop('class', 'lobby-room-name')
                .text(room))
            .append(
              $('<span>')
                .prop('class', 'lobby-room-info')
                .text(users.length + "/" + Constants.ROOM_CAPACITY))
            .click(function(event) {
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
                .prop('class', 'lobby-current-room-user-name')
                .text(user.user))
            .append(
              $('<span>')
                .prop('class', 'lobby-current-room-user-ready')
                .text(user.ready ? 'Ready' : 'Not ready')));
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
        $('#lobby-create-input').val('');
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
  this.ready = false;
}

Lobby.prototype.leaveRoom = function() {
  socket.emit('leave-room', {});
  $('#lobby-current-room-container').hide();
  $('#lobby-rooms-container').show();
  this.currentRoom = '';
}

Lobby.prototype.toggleReady = function() {
  this.ready = !this.ready;
  $('#lobby-ready-submit').text(this.ready ? 'Unready' : 'Ready');
  socket.emit('set-ready-state', {
    room: this.currentRoom,
    state: this.ready
  });
}
             
Lobby.prototype.sendMessage = function() {
  socket.emit('chat-client-to-server', {
    message: $('#lobby-chat-input').val()
  });
  $('#lobby-chat-input').val('');
}

Lobby.prototype.receiveMessage = function(data) {
  $('#lobby-chat-history')
    .append(document.createTextNode('[' + data.name + '] ' + data.message + '\n'))
    .scrollTop($('#lobby-chat-history')[0].scrollHeight);  
}
