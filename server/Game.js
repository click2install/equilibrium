/**
 * This is a class that stores the state of an active game on the server side.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

// Dependencies
var Hashmap = require('hashmap');

var Anchor = require('./Anchor');
var Player = require('./Player');

var Constants = require('../shared/Constants');
var Util = require('../shared/Util');

function Game(sockets, players) {
  this.sockets = sockets;
  this.players = players;

  this.entities = [];
}

Game.ANCHOR_COUNT = 50;

/**
 * Factory method for a game. We can assume that sockets and users are both
 * hashmaps with the same keys in each.
 */
Game.create = function(sockets, users) {
  var keys = sockets.keys();
  var players = new Hashmap();
  for (var key of keys) {
    var playerX = Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX);
    var playerY = Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX);
    players.set(key, Player.create(users.get(key).user, playerX, playerY));
  }
  var game = new Game(sockets, players);
  game.init();
  return game;
};

/**
 * This method initializes the event listeners for the sockets after the
 * Game object has been created.
 */
Game.prototype.init = function() {
  var players = this.players;
  this.sockets.forEach(function(socket, socketId) {
    socket.on('player-action', function(data) {
      players.get(socketId).updateOnInput(data.mouseX, data.mouseY,
                                          data.leftClick, data.rightClick);
    });
  });

  for (var i = 0; i < Game.ANCHOR_COUNT; ++i) {
    var anchorX = Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX);
    var anchorY = Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX);
    this.entities.push(Anchor.create(anchorX, anchorY));
  }
};

/**
 * This method updates the state of all the entities in the game.
 */
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
    entity.update();
  }
};

/**
 * This method returns whether or not this game has ended so that the game
 * can be removed from the GameManager and the players returned to the Lobby.
 */
Game.prototype.hasEnded = function() {
  return false;
};

/**
 * This method sends the current state of the game to the all the players
 * connected to this game instance.
 */
Game.prototype.sendState = function() {
  var ids = this.sockets.keys();
  for (var id of ids) {
    var currentSocket = this.sockets.get(id);
    var currentPlayer = this.players.get(id);
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
