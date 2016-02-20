/**
 * This is a class that stores the state of a Player on the server side.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

function Player(socket) {
  this.socket = socket;
}


Player.create = function() {
};

module.exports = Player;
