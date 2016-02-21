/**
 * This is a class that stores the state of a Player on the server side.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var Entity = require('Entity');

function Player(socket, x, y) {
  this.socket = socket;

  this.x = x;
  this.y = y;
}
require('../shared/inheritable');
Player.inheritsFrom(Entity);

Player.create = function(socket, x, y) {
  return new Player(socket)
};

module.exports = Player;
