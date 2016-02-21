/**
 * This is a class that stores the state of an active game on the server side.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

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

  return new Game(players);
};

Game.prototype.init = function() {
  for (var player of this.players) {
    player.socket.on('player-action', function(data) {
//      player.updateOnInput(data);
    });
  }
};

Game.prototype.update = function() {
};

Game.prototype.hasEnded = function() {
  return false;
};

Game.prototype.sendState = function() {
  for (var currentPlayer of this.players) {
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
