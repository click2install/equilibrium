/**
 * This class manages and updates the client lobby.
 * @author Kenneth Li (kennethli.3470@gmail.com)
 * @requires jQuery
 */

/**
 * Constructor for the Lobby class.
 * @param {Object} socket The socket associated with the current user.
 * @param {Object} lobbyEl The container element for the lobby.
 * @param {function()} startGame The callback function that starts the game based
 *   on information from the server.
 */
function Lobby(socket, lobbyEl, startGame) {
  this.socket = socket;
  this.lobbyEl = lobbyEl;
  this.startGame = startGame;
  this.currentRoom = '';
  this.ready = false;
}

var x; // Temporary debug variable

/**
 * Factory method for the Lobby class.
 * @param {Object} socket The socket associated with the current user.
 * @param {Object} lobbyEl The container element for the lobby.
 * @param {function()} startGame The callback function that starts the game based
 *   on information from the server.
 * @return {Lobby}
 */
Lobby.create = function(socket, lobbyEl, startGame) {
  return new Lobby(socket, lobbyEl, startGame);
}

/**
 * Initializes the lobby and starts listening for data packets from the server.
 */
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

/**
 * Generates the DOM elements for the lobby and adds form actions.
 */
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
                event.preventDefault(); // Stops page from redirecting
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
                  .prop('placeholder', 'Enter message here')
                  .prop('autocomplete', false))
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

/**
 * Wrapper function to show the lobby.
 */
Lobby.prototype.show = function() {
  this.lobbyEl.show();
}

/**
 * Wrapper function to hide the lobby.
 */
Lobby.prototype.hide = function() {
  this.lobbyEl.hide();
}

/**
 * Updates the lobby with data from lobby-update packets.
 * @param {Object} data The JSON object containing data from the server.
 */
Lobby.prototype.update = function(data) {
  with (this) {
    x = data;
    
    if (data.gameStart) { // Starts game if server sends a special packet with gameStart
      this.startGame();
    } else {
      if (currentRoom == '') { // Updates list of all rooms if not already in a room
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
              .click(function(event) { // Joins a room when clicked
                event.preventDefault();
                joinRoom(room);
              }));
        });

        $('#lobby-rooms').empty();
        $('#lobby-rooms').append.apply($('#lobby-rooms'), rooms);
      } else { // Displays users in room if already in a room
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

      // Displays all users not in a room
      var freeUsers = [];
      
      $.each(data.freeUsers, function(i, freeUser) {
        freeUsers.push($('<li>').text(freeUser));
      });

      $('#lobby-users').empty();
      $('#lobby-users').append.apply($('#lobby-users'), freeUsers);
    }
  }
}

/**
 * Creates a room in the lobby and automatically joins it.
 */
Lobby.prototype.createRoom = function() {
  with (this) {
    var room = $('#lobby-create-input').val(); // Gets room name from input field
    
    socket.emit('create-room', {
      room: room
    }, function(status) {
      if (status.success) {
        $('#lobby-create-input').val(''); // Clears input field after room is created.
        enterRoom(room);
      } else {
        window.alert(status.message);
      }
    });
  }
}

/**
 * Joins an existing room in the lobby.
 */
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

/**
 * Changes main lobby interface to current room interface.
 */
Lobby.prototype.enterRoom = function(room) {
  $('#lobby-rooms-container').hide();
  $('#lobby-current-room-title').text('Room ' + room);
  $('#lobby-current-room-container').show();
  this.currentRoom = room;
  this.ready = false;
}

/**
 * Leaves current room and changes interface.
 */
Lobby.prototype.leaveRoom = function() {
  socket.emit('leave-room', {});
  $('#lobby-current-room-container').hide();
  $('#lobby-rooms-container').show();
  this.currentRoom = '';
}

/**
 * Toggles ready status of player.
 */
Lobby.prototype.toggleReady = function() {
  this.ready = !this.ready;
  $('#lobby-ready-submit').text(this.ready ? 'Unready' : 'Ready');
  socket.emit('set-ready-state', {
    room: this.currentRoom,
    state: this.ready
  });
}

/**
 * Sends chat message to server.
 */
Lobby.prototype.sendMessage = function() {
  socket.emit('chat-client-to-server', {
    message: $('#lobby-chat-input').val() // Reads chat message from input field
  });
  $('#lobby-chat-input').val(''); // Clears input field after sending message
}

/**
 * Receives chat messages from server.
 * @param {Object} data The JSON object containing the name of sender and the message.
 */
Lobby.prototype.receiveMessage = function(data) {
  $('#lobby-chat-history')
    .append(document.createTextNode('[' + data.name + '] ' + data.message + '\n'))
    .scrollTop($('#lobby-chat-history')[0].scrollHeight);  
}
