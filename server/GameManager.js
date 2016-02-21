/**
 * This is a class that manages all active game sessions and takes care of
 * updating them when they start and end.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var Game = require('./Game');

function GameManager(io) {
  this.io = io;

  this.games = [];
}

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
  // TODO
};

/**
 * This method takes care of updating the internal state of every active game
 * and sending the state to the appropriate clients.
 */
GameManager.prototype.update = function() {
  this.games.forEach(function(current, index, array) {
    current.update();
    current.sendState();
  });
};

module.exports = GameManager;
