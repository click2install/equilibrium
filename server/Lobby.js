/**
 * This is a class that manages the state of the pre-game lobby.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var Hashmap = require('hashmap');

function Lobby() {
  /**
   * freeSockets and freeUsers represents the sockets and the users that are
   * not connected to a room.
   */
  this.freeSockets = new Hashmap();
  this.freeUsers = new Hashmap();
  /**
   *
   */
  this.rooms = {};
}

/**
 * Factory method for a Lobby.
 * @return {Lobby}
 */
Lobby.create = function() {
  return new Lobby();
};

/**
 * This method adds a new user to the lobby.
 * @param {string} socketId The id of the user's socket.
 * @param {Socket} socket The socket of the user.
 * @param {string} username The username of the user.
 */
Lobby.prototype.addUser = function(socketId, socket, username) {
  this.freeSockets.set(id, socket);
  this.freeUsers.set(id, username);
};

Lobby.prototype.createRoom = function(name) {
  this.rooms[name] = {
    sockets: new Hashmap(),
    users: new Hashmap()
  }
};

Lobby.prototype.joinRoom = function(name, socketId) {
  var socket = this.freeSockets.remove(socketId);
  var user = this.freeUsers.remove(socketId);
  this.rooms[name].sockets.set(socketId, socket);
  this.rooms[name].users.set(socketId, user);
};

Lobby.prototype.remove = function(id) {
  this.freeSockets.remove(id);
  this.freeUsers.remove(id);
  // TODO: remove from room
};

Lobby.prototype.formStatePacket = function() {
  return {
    freeUsers: this.freeUsers.values(),
    rooms: this.rooms
  }
};

module.exports = Lobby;
