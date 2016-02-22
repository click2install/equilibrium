/**
 * This is a class that stores the state of an Anchor on the server side.
 * An Anchor represents anything that can be pushed or pulled by a player.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var Entity = require('./Entity');

var Util = require('../shared/Util');

function Anchor(x, y, weight) {
  this.x = x;
  this.y = y;

  this.hitboxSize = weight;
  this.weight = weight;
}
require('../shared/inheritable');
Anchor.inheritsFrom(Entity);

Anchor.MIN_WEIGHT = 12;
Anchor.MAX_WEIGHT = 25;

/**
 * Factory method for an Anchor.
 * @param {number} x The starting x coordinate of the Anchor in absolute
 *   world coordinates.
 * @param {number} y The starting y coordinate of the Anchor in absolute
 *   world coordinates.
 */
Anchor.create = function(x, y, weight) {
  return new Anchor(x, y, weight);
};

Anchor.update = function() {
  this.parent.update.call(this);
  this.decelerate();
};

module.exports = Anchor;
