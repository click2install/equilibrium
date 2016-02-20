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
 * @param {string} socketId The socket ID of the user.
 * @param {Socket} socket The socket of the user.
 * @param {string} username The username of the user.
 */
Lobby.prototype.addUser = function(socketId, socket, username) {
  this.freeSockets.set(socketId, socket);
  this.freeUsers.set(socketId, username);
};

/**
 * This method creates a room with the given name and returns an object
 * detailing whether or not the room was created.
 * @param {string} name The name of the room to create.
 * @return {Object}
 */
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

/**
 * This method moves a player into a room.
 * @param {string} name The name of the room to put the player into.
 * @param {string} socketId The socket ID of the player to move.
 */
Lobby.prototype.joinRoom = function(name, socketId) {
  var socket = this.freeSockets.get(socketId);
  var user = this.freeUsers.get(socketId);
  if (user && socket) {
    this.freeSockets.remove(socketId);
    this.freeUsers.remove(socketId);
  } else {
    return {
      success: false,
      message: 'An unknown error occurred, please shoot yourself.'
    }
  }
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

/**
 * This method removes a player from the internal hashmaps.
 * @param {string} socketId The socket ID of the palyer to remove.
 */
Lobby.prototype.remove = function(socketId) {
  this.freeSockets.remove(socketId);
  this.freeUsers.remove(socketId);
  this.rooms.keys().forEach(function(current, index, array) {
    this.rooms.get(current).sockets.remove(socketId);
    this.rooms.get(current).users.remove(socketId);
  });
};

/**
 * This method returns a JSON object representation of the lobby that gets
 * sent to the client.
 * @return {Object}
 */
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
