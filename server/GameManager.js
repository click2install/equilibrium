/**
 * This is a class that manages all active game sessions and takes care of
 * updating them when they start and end.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var Game = require('./Game');

var Util = require('../shared/Util');

function GameManager(io) {
  this.io = io;

  this.games = [];
}

/**
 * Factory method to create a GameManager.
 * @return {GameManager}
 */
GameManager.create = function(io) {
  return new GameManager(io);
};

/**
 * Given a room removed from the Lobby class (schema detailed in Lobby.js),
 * this method will create a socket channel for the game and begin sending
 * update packets to the game.
 * @param {Object} room The game room from the lobby that we should create
 *   a new active Game for.
 */
GameManager.prototype.newGame = function(room) {
  // Emit the lobby-update packet to all users that have started a game.
  for (var socket of room.sockets.values()) {
    socket.emit('lobby-update', {
      gameStart: true
    });
  }
  this.games.push(Game.create(room.sockets, room.users));
};

/**
 * This method takes care of updating the internal state of every active game
 * and sending the state to the appropriate clients.
 * @param {function()} endGameCallback This is a callback that allows players
 *   in games that have ended to be added back to the lobby.
 */
GameManager.prototype.update = function(endGameCallback) {
  for (var i = 0; i < this.games.length; ++i) {
    if (this.games[i].hasEnded()) {
      var game = this.games.splice(i, 1);
      i--;
      endGameCallback(game);
    }
    this.games[i].update();
    this.games[i].sendState();
  }
};

module.exports = GameManager;
