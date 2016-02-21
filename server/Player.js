/**
 * This is a class that stores the state of a Player on the server side.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var Entity = require('./Entity');

function Player(name, x, y) {
  this.name = name;

  this.hp = Player.MAX_HEALTH;
  this.weight = Player.DEFAULT_WEIGHT;

  this.x = x;
  this.y = y;
}
require('../shared/inheritable');
Player.inheritsFrom(Entity);

Player.MAX_HEALTH = 100;
Player.DEFAULT_WEIGHT = 10;

Player.create = function(name, x, y) {
  return new Player(name, x, y);
};

/**
 * This method sets the player's accelerations appropriately based on
 * whether or not they are exerting a push force (left click) or pull force
 * (right click).
 * @param {number} mouseX The x-coordinate of the player's mouse in absolute
 *   world coordinates.
 * @param {number} mouseY The y-coordinate of the player's mouse in absolute
 *   world coordinates.
 * @param {boolean} leftClick The state of the player's left mouse button.
 * @param {boolean} rightClick The state of the player's right mouse button.
 */
Player.prototype.updateOnInput = function(mouseX, mouseY,
                                          leftClick, rightClick) {
  // TODO: Add acceleration and velocity modifiers.
};

/**
 * This method updates the player and checks for collisions against other
 * players and entities.
 */
Player.prototype.update = function(players, entities) {
  this.parent.update.call(this);
};

module.exports = Player;
