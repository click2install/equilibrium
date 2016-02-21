function Game(socket, containerEl, canvasEl, drawing, endGame) {
  this.socket = socket;
  this.containerEl = containerEl;
  this.canvasEl = canvasEl;
  this.drawing = drawing;
  this.endGame = endGame;
}

Game.create = function(socket, containerEl, endGame) {
  var canvasEl = $('<canvas>').prop('id', 'canvas');
  var drawing = Drawing.create(this, canvasEl);
  return new Game(socket, containerEl, canvasEl, drawing, endGame);
}

Game.prototype.init = function() {
  this.containerEl.append(this.canvasEl);
  this.drawing.init();
}

Game.prototype.start = function() {
  this.containerEl.show();
}
