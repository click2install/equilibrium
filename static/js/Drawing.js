function Drawing(game, canvasEl) {
  this.game = game;
  this.canvasEl = canvasEl;
}

Drawing.create = function(game, canvasEl) {
  return new Drawing(game, canvasEl);
}

Drawing.prototype.init = function() {

}
