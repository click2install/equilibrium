var socket = io();
var lobby = Lobby.create(socket, $('#lobby'));

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
}

