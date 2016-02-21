/**
 * This is a class that manages all active game sessions and takes care of
 * updating them when they start and end.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var Game = require('./Game');

function GameManager() {
  this.games = [];
}

GameManager.create = function() {
  return new GameManager();
};

GameManager.prototype.newGame = function(room) {

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
