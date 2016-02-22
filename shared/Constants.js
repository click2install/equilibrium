/**
 * This class stores global constants between the client and server.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

/**
 * Empty constructor for the Constants class.
 * @constructor
 */
function Constants() {
  throw new Error('Constants should not be instantiated!');
}

Constants.ROOM_CAPACITY = 4;
Constants.CANVAS_WIDTH = 800;
Constants.CANVAS_HEIGHT = 600;

Constants.WORLD_MIN = 0;
Constants.WORLD_MAX = 1000;

Constants.ENTITY_DECELERATION = 0.00025;

try {
  module.exports = Constants;
} catch (err) {}
