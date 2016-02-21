/**
 * This is a class that stores the state of an active game on the server side.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var Player = require('./Player');

function Game(players) {
  this.players = players;

  this.entities = [];
}

/**
 * Factory method for a game. We can assume that sockets and users are both
 * hashmaps with the same keys in each.
 */
Game.create = function(sockets, users) {
  var keys = sockets.keys();
  var players = [];
  for (var key of keys) {
    players.push(Player.create(sockets.get(key), users.get(key), 0, 0));
  }
  var game = new Game(players);
  game.init();
  return game;
};

Game.prototype.init = function() {
  for (var player of this.players) {
    player.socket.on('player-action', function(data) {
      console.log(data);
      player.updateOnInput(data.mouseX, data.mouseY,
                           data.leftClick, data.rightClick);
    });
  }
};

Game.prototype.update = function() {
  for (var player of this.players) {
    var otherPlayers = this.players.filter(function(otherPlayer) {
      return player != otherPlayer;
    });
    player.update(otherPlayers, this.entities);
  }
  for (var entity of this.entities) {
    var otherEntities = this.entities.filter(function(otherEntity) {
      return entity != otherEntity;
    });
    entity.update(this.players, otherEntities);
  }
};

Game.prototype.hasEnded = function() {
  return false;
};

Game.prototype.sendState = function() {
  for (var i = 0; i < this.players.length; ++i) {
    var currentPlayer = this.players[i];
    currentPlayer.socket.emit('server-update', {
      self: currentPlayer,
      players: this.players.filter(function(player) {
        return player != currentPlayer;
      }),
      entities: this.entities
    });
  }
};

module.exports = Game;
