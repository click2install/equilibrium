var socket = io();
var lobby = Lobby.create(socket,
                         $('#lobby-container'),
                         function() {  // function to start game passed as callback to lobby
                           startGame();
                         });
var game = Game.create(socket,
                       $('#canvas-container'),
                       function() {
                         endGame();
                       });

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

function init() {
  lobby.init();
  game.init();
}

function startGame() {
  game.start();
}

function endGame() {
  
}
