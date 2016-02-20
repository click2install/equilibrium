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
  this.rooms = new Hashmap();
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
  this.freeSockets.set(socketId, socket);
  this.freeUsers.set(socketId, username);
};

Lobby.prototype.createRoom = function(name) {
  if (this.rooms.has(name)) {
    return {
      success: false,
      message: "Room already exists."
    }
  }
  this.rooms.set(name, {
    sockets: new Hashmap(),
    users: new Hashmap()
  });
  return {
    success: true,
    message: "Room created."
  }
};

Lobby.prototype.joinRoom = function(name, socketId) {
  var socket = this.freeSockets.remove(socketId);
  var user = this.freeUsers.remove(socketId);
  var room = this.rooms.get(name);
  if (room) {
    if (room.users.values().length >= 4) {
      return {
        success: false,
        message: "Room is full."
      }
    }
    room.sockets.set(socketId, socket);
    room.users.set(socketId, user);
    return {
      success: true,
      message: "Room joined."
    }
  }
  return {
    success: false,
    message: "Room does not exist."
  }
};

Lobby.prototype.remove = function(id) {
  this.freeSockets.remove(id);
  this.freeUsers.remove(id);
  this.rooms.keys().forEach(function(current, index, array) {
    this.rooms.get(current).sockets.remove(id);
    this.rooms.get(current).users.remove(id);
  });
};

Lobby.prototype.formStatePacket = function() {
  var rooms = {}
  this.rooms.forEach(function(value, key) {
    rooms[key] = value.users.values();
  });
  return {
    freeUsers: this.freeUsers.values(),
    rooms: rooms
  }
};

module.exports = Lobby;
