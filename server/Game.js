/**
 * This is a class that stores the state of an active game on the server side.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

function Game(player) {
  this.players = players;
}

/**
 * Factory method for a game. We can assume that sockets and users are both
 * hashmap with the same keys in each.
 */
Game.create = function(sockets, users) {
  var keys = sockets.keys();
  for (var socket in sockets.values()) {
    socket.emit('lobby-update', {
      gameStart: true
    });
  }
};

Game.update = function() {
};

Game.sendState = function() {
};

module.exports = Game;
