/**
 * This class handles the rendering of elements onto the HTML5 canvas.
 * @author Kenneth Li (kennethli.3470@gmail.com)
 */

/**
 * Constructor for the Drawing object.
 * @constructor
 * @param {Object} context The context to which this drawing object will render.
 */
function Drawing(context) {
  this.context = context;
}

/** 
 * Constants for the Drawing class.
 */
Drawing.SELF_COLOR = 'green';
Drawing.OTHER_COLOR = 'red';
Drawing.ENTITY_COLOR = 'gray';

/**
 * Factory method for creating new instances of the Drawing class.
 * @param {Object} context The context to which the drawing object will render.
 */
Drawing.create = function(context) {
  return new Drawing(context);
}

/**
 * Initializes drawing class and caches images from the server.
 */
Drawing.prototype.init = function() {

}

/**
 * Clears the canvas.
 */
Drawing.prototype.clear = function() {
  this.context.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
}

/**
 * Draws the self player onto the canvas.
 * @param {[number, number]} coords THe coordinates of the player.
 * @param {number} weight The weight of the player.
 */
Drawing.prototype.drawSelf = function(coords, weight) {
  this.drawCircle(coords[0], coords[1], weight, Drawing.SELF_COLOR);
}

/**
 * Draws a non-self player onto the canvas.
 * @param {[number, number]} coords THe coordinates of the player.
 * @param {number} weight The weight of the player.
 */
Drawing.prototype.drawPlayer = function(coords, weight) {
  this.drawCircle(coords[0], coords[1], weight, Drawing.OTHER_COLOR);
}

/**
 * Draws an entity onto the canvas.
 * @param {[number, number]} coords THe coordinates of the entity.
 * @param {number} weight The weight of the entity.
 */
Drawing.prototype.drawEntity = function(coords, weight) {
  this.drawCircle(coords[0], coords[1], weight, Drawing.ENTITY_COLOR);
}

/**
 * Draws a circle on the canvas.
 * @param {number} x The x coordinate of the center.
 * @param {number} y The y coordinate of the center.
 * @param {number} r The radius of he circle.
 * @param {string} color The color of the circle.
 */
Drawing.prototype.drawCircle = function(x, y, r, color) {
  this.context.beginPath();
  this.context.arc(x, y, r, 0, 2 * Math.PI, false);
  this.context.fillStyle = color;
  this.context.fill();
}
