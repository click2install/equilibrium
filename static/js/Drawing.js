/**
 * This class handles the rendering of elements onto the HTML5 canvas.
 * @author Kenneth Li (kennethli.3470@gmail.com)
 */

/**
 * Constructor for the Drawing object.
 * @constructor
 * @param {Object} game The game object corresponding to this drawing object.
 * @param {Object} canvasEl The canvas element to which this drawing object will render.
 */
function Drawing(game, canvasEl) {
  this.game = game;
  this.canvasEl = canvasEl;
}

/**
 * Factory method for creating new instances of the Drawing class.
 * @param {Object} game The game object with which the drawing will be instantiated.
 * @param {Object} canvasEl The canvas element to which the drawing object will render.
 */
Drawing.create = function(game, canvasEl) {
  return new Drawing(game, canvasEl);
}

/**
 * Initializes drawing class and caches images from the server.
 */
Drawing.prototype.init = function() {

}
