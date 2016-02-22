/**
 * This is the app script that is run on the server.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var DEV_MODE = false;
var GAME_FRAME_RATE = 1000.0 / 60.0;
var IP = process.env.IP || 'localhost';
var LOBBY_UPDATE_RATE = 1000.0 / 2.0;
var PORT_NUMBER = process.env.PORT || 5000;

process.argv.forEach(function(value, index, array) {
  if (value == '--dev' || value == '-dev' ||
      value == '--development' || value == '-development') {
    DEV_MODE = true;
  }
});

// Dependencies.
var express = require('express');
var http = require('http');
var morgan = require('morgan');
var socketIO = require('socket.io');
var swig = require('swig');

var GameManager = require('./server/GameManager');
var Lobby = require('./server/Lobby');

// Initialization.
var app = express();
var server = http.Server(app);
var io = socketIO(server);

var gameManager = GameManager.create(io);
var lobby = Lobby.create();

app.engine('html', swig.renderFile);

app.set('port', PORT_NUMBER);
app.set('view engine', 'html');

app.use(morgan(':date[web] :method :url :req[header] :remote-addr :status'));
app.use('/bower_components',
        express.static(__dirname + '/bower_components'));
app.use('/static',
        express.static(__dirname + '/static'));
app.use('/shared',
        express.static(__dirname + '/shared'));

// Routing
app.get('/', function(request, response) {
  response.render('index.html', {
    dev_mode: DEV_MODE
  });
});

// Websocket handling
io.on('connection', function(socket) {
  socket.on('chat-client-to-server', function(data) {
    io.sockets.emit('chat-server-to-client', {
      name: lobby.getUsernameBySocketId(socket.id),
      message: data.message
    });
  });

  socket.on('new-player', function(data, callback) {
    var status = lobby.addUser(socket.id, socket, data.name);
    callback(status);
  });

  socket.on('create-room', function(data, callback) {
    var status = lobby.createRoom(data.room);
    if (status.success) {
      status = lobby.joinRoom(data.room, socket.id);
    }
    callback(status);
  });

  socket.on('join-room', function(data, callback) {
    var status = lobby.joinRoom(data.room, socket.id);
    callback(status);
  });

  socket.on('set-ready-state', function(data) {
    lobby.setReadyState(data.room, socket.id, data.state);
  });

  socket.on('leave-room', function(data) {
    var user = lobby.remove(socket.id);
    lobby.addUser(socket.id, socket, user);
  });

  socket.on('disconnect', function() {
    lobby.remove(socket.id);
  });
});

// Server side loop to send update packets for the lobby.
setInterval(function() {
  // When we update the lobby, it checks if a game is ready to be started, so
  // we pass it a callback that starts a game when it finds a room in the
  // lobby that is ready to start.
  lobby.update(function(room) {
    gameManager.newGame(room);
  });

  // After the update, we serialize the state of the lobby so that it can be
  // sent to the client through the WebSocket connection.
  var lobbyState = lobby.getStatePacket();
  io.emit('lobby-update', lobbyState);
}, LOBBY_UPDATE_RATE);

// Server side loop to send update packets for the game.
setInterval(function() {
  gameManager.update(function() {
  });
});

// Starts the server.
server.listen(PORT_NUMBER, function() {
  console.log('STARTING SERVER ON PORT ' + PORT_NUMBER);
  if (DEV_MODE) {
    console.log('DEVELOPMENT MODE ENABLED: SERVING UNCOMPILED JAVASCRIPT!');
  }
});
