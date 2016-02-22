/**
 * This is a class that stores the state of a Player on the server side.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var Entity = require('./Entity');

var Util = require('../shared/Util');

function Player(name, x, y) {
  this.name = name;

  this.x = x;
  this.y = y;

  this.hp = Player.MAX_HEALTH;
  this.hitboxSize = this.weight;
  this.weight = Player.DEFAULT_WEIGHT;

  this.isPushing = false;
  this.isPulling = false;
  this.lastMouseCoords = {};
}
require('../shared/inheritable');
Player.inheritsFrom(Entity);

Player.MAX_HEALTH = 100;
Player.DEFAULT_WEIGHT = 20;
Player.FORCE_ACCELERATION = 0.0005;

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
  this.isPushing = leftClick;
  this.isPulling = rightClick;
  this.lastMouseCoords = {
    x: mouseX,
    y: mouseY
  };
};

/**
 * This method updates the player and checks for collisions against other
 * players and entities.
 */
Player.prototype.update = function(players, entities) {
  this.parent.update.call(this);

  if (this.isPushing) {
    for (var entity of entities) {
      if (entity.isOnPoint(this.lastMouseCoords.x, this.lastMouseCoords.y)) {
        var angle = Math.atan2(entity.y - this.y, entity.x - this.x);
        if (this.weight <= entity.weight) {
          this.ax = Math.cos(angle) * -Player.FORCE_ACCELERATION;
          this.ay = Math.sin(angle) * -Player.FORCE_ACCELERATION;
        } else {
          entity.ax = Math.cos(angle) * Player.FORCE_ACCELERATION;
          entity.ay = Math.sin(angle) * Player.FORCE_ACCELERATION;
        }
        break;
      } else {
        this.decelerate();
      }
    }
  } else if (this.isPulling) {
    for (var entity of entities) {
      if (entity.isOnPoint(this.lastMouseCoords.x, this.lastMouseCoords.y)) {
        var angle = Math.atan2(entity.y - this.y, entity.x - this.x);
        if (this.weight <= entity.weight) {
          this.ax = Math.cos(angle) * Player.FORCE_ACCELERATION;
          this.ay = Math.sin(angle) * Player.FORCE_ACCELERATION;
        } else {
          entity.ax = Math.cos(angle) * -Player.FORCE_ACCELERATION;
          entity.ay = Math.sin(angle) * -Player.FORCE_ACCELERATION;
        }
        break;
      } else {
        this.decelerate();
      }
    }
  } else {
    this.decelerate();
  }

  for (var entity of entities) {
    if (this.isCollidedWith(entity)) {
      console.log('hi');
      this.vx = 0;
      this.vy = 0;
      var angle = Math.atan2(entity.y - this.y, entity.x - this.x);
      var minDistance = this.hitboxSize + entity.hitboxSize;
      this.x = Math.cos(angle) * minDistance;
      this.y = Math.sin(angle) * minDistance;
    }
  }
};

module.exports = Player;
