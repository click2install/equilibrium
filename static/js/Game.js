/**
 * This class manages game interactions and communication with the renderer.
 * @param {Object} socket The socket associated with the current session.
 * @param {Object} containerEl The container element of the canvas.
 * @param {Object} canvasEl The canvas to which the drawing class will render.
 * @param {Object} drawing The drawing object associated with the game.
 * @param {function()} endGame The callback used to end the game and return to the lobby.
 */
function Game(socket, containerEl, canvasEl, drawing, endGame) {
  this.socket = socket;
  this.containerEl = containerEl;
  this.canvasEl = canvasEl;
  this.drawing = drawing;
  this.endGame = endGame;
}

/**
 * Factory method for the Game class.
 * @param {Object} socket The socket associated with the current session.
 * @param {Object} containerEl The container element of the canvas.
 * @param {function()} endGame The callback used to end the game and return to the lobby.
 * @return {Game}
 */
Game.create = function(socket, containerEl, endGame) {
  var canvasEl = $('<canvas>').prop('id', 'canvas');
  var drawing = Drawing.create(this, canvasEl);
  return new Game(socket, containerEl, canvasEl, drawing, endGame);
}

/**
 * Initializes the game object and the drawing object.
 */
Game.prototype.init = function() {
  this.containerEl.append(this.canvasEl);
  this.drawing.init();
}

/**
 * Starts the game.
 */
Game.prototype.start = function() {
  this.containerEl.show();
}
