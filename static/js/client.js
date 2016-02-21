/**
 * This driver manages all aspects of the client (socket, lobby, game).
 * @author Kenneth Li (kennethli.3470@gmail.com)
 * @requires jQuery
 */

var socket = io();
var lobby = Lobby.create(socket,
                         $('#lobby-container'),
                         function() {  // function to start game passed as callback to lobby
                           startGame();
                         });
var game = Game.create(socket,
                       $('#canvas-container'),
                       function() {  // function to end game passed as callback to game
                         endGame();
                       });

// Initializes client interface with name input.
$('document').ready(function() {
  lobby.hide();
  $('#name-input').focus();

  $('#name-form').submit(function() {
    var name = $('#name-input').val();
    
    socket.emit('new-player', {
      name: name
    });

    $('#name-container').hide();
    lobby.show();

    return false;
  });
  
  init();
});

// Calls initialization functions for lobby and game objects.
function init() {
  lobby.init();
  game.init();
}

// Starts the game, dictated by the lobby object.
function startGame() {
  lobby.hide();
  game.start();
  animate();
}

// Ends the game and returns to the lobby, dictated by the game object.
function endGame() {
  
}

// Animates the game at 60 FPS using the requestAnimFrame script.
function animate() {
  game.update();
  game.draw();
  window.requestAnimFrame(animate);
}

