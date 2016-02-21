/**
 * This is a class that stores the state of an active game on the server side.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

// Dependencies
var Hashmap = require('hashmap');

var Player = require('./Player');

function Game(sockets, players) {
  this.sockets = sockets;
  this.players = players;

  this.entities = [];
}

/**
 * Factory method for a game. We can assume that sockets and users are both
 * hashmaps with the same keys in each.
 */
Game.create = function(sockets, users) {
  var keys = sockets.keys();
  var players = new Hashmap();
  for (var key of keys) {
    players.set(key, Player.create(users.get(key).user, 0, 0));
  }
  var game = new Game(sockets, players);
  game.init();
  return game;
};

Game.prototype.init = function() {
  var players = this.players;
  this.sockets.forEach(function(socket, socketId) {
    socket.on('player-action', function(data) {
      players.get(socketId).updateOnInput(data.mouseX, data.mouseY,
                                          data.leftClick, data.rightClick);
    });
  });
};

Game.prototype.update = function() {
  var players = this.players.values();
  for (var player of players) {
    var otherPlayers = players.filter(function(otherPlayer) {
      return player != otherPlayer;
    });
    player.update(otherPlayers, this.entities);
  }
  for (var entity of this.entities) {
    var otherEntities = this.entities.filter(function(otherEntity) {
      return entity != otherEntity;
    });
    entity.update(players, otherEntities);
  }
};

Game.prototype.hasEnded = function() {
  return false;
};

Game.prototype.sendState = function() {
  var ids = this.sockets.keys();
  for (var id of ids) {
    var currentSocket = this.sockets.get(id);
    var currentPlayer = this.players.get(id);
    console.log(id, currentPlayer);
    currentSocket.emit('server-update', {
      self: currentPlayer,
      players: this.players.values().filter(function(player) {
        return player != currentPlayer;
      }),
      entities: this.entities
    });
  }
};

module.exports = Game;
