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
  this.games.push(Game.create(room.sockets, room.users));
};

/**
 * This method takes care of updating the internal state of every active game
 * and sending the state to the appropriate clients.
 */
GameManager.prototype.update = function() {
  for (var game of this.games) {
    game.update();
    game.sendState();
  }
};

module.exports = GameManager;
