/**
 * This is a class that stores the state of a Player on the server side.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var Entity = require('./Entity');

function Player(socket, name, x, y) {
  this.socket = socket;
  this.name = name;

  this.x = x;
  this.y = y;
}
require('../shared/inheritable');
Player.inheritsFrom(Entity);

Player.create = function(socket, name, x, y) {
  return new Player(socket, name, x, y);
};

Player.prototype.updateOnInput = function() {

};

Player.prototype.update = function() {
};

module.exports = Player;
