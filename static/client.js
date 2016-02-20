var socket = io();
//var game = Game.create(socket, document.getElementById('canvas'));

$('document').ready(function() {
  $('#name-input').focus();

  function send_name() {
    var name = $('#name-input').val();
    console.log(name);
    
    socket.emit('new-player', {
      name: name
    });

    $('#name-container').hide();
    $('#lobby').show();

    return false;
  }
  
  $('#name-form').submit(send_name);
  $('#name-submit').click(send_name);

  socket.on('lobby-update', function(data) {
    var freeUsers = data.freeUsers;
    var rooms = data.rooms;
  });
});
