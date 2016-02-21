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
   * A Hashmap of rooms.
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
 * @param {string} room The name of the room to create.
 * @return {Object}
 */
Lobby.prototype.createRoom = function(roomName) {
  if (this.rooms.has(roomName)) {
    return {
      success: false,
      message: "Room already exists."
    }
  }
  this.rooms.set(roomName, {
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
 * @param {string} roomName The name of the room to put the player into.
 * @param {string} socketId The socket ID of the player to move.
 */
Lobby.prototype.joinRoom = function(roomName, socketId) {
  var socket = this.freeSockets.get(socketId);
  var user = this.freeUsers.get(socketId);
  if (user && socket) {
    this.freeSockets.remove(socketId);
    this.freeUsers.remove(socketId);
  } else {
    return {
      success: false,
      message: 'You must leave your current room.'
    }
  }
  var room = this.rooms.get(roomName);
  if (room) {
    if (room.users.values().length >= 4) {
      return {
        success: false,
        message: "Room is full."
      }
    }
    room.sockets.set(socketId, socket);
    room.users.set(socketId, {
      user: user,
      ready: false
    });
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
 * This method sets the ready state of a user in a room.
 * @param {string} roomName The name of the room that the user is in.
 * @param {string} socketId The socket ID of the user.
 * @param {boolean} state The ready state to set the user to.
 */
Lobby.prototype.setReadyState = function(roomName, socketId, state) {
  var room = this.rooms.get(roomName);
  if (room) {
    var user = room.get(user);
    if (user) {
      room.set(user, {
        user: user,
        ready: state
      });
    }
  }
};

/**
 * This method updates the lobby and removes empty rooms.
 */
Lobby.prototype.update = function() {
  for (var room of this.rooms.keys()) {
    if (this.rooms.get(room).users.values().length == 0) {
      this.removeRoom(room);
    }
  }
};

/**
 * This method removes a room from the internal hashmaps.
 * @param {string} roomName The name of the room to remove.
 */
Lobby.prototype.removeRoom = function(roomName) {
  var room = this.rooms.get(roomName);
  this.rooms.remove(roomName);
  return room;
};

/**
 * This method removes a player from the internal hashmaps and returns their
 * username.
 * @param {string} socketId The socket ID of the palyer to remove.
 */
Lobby.prototype.remove = function(socketId) {
  var user = this.freeUsers.get(socketId);
  if (user) {
    this.freeSockets.remove(socketId);
    this.freeUsers.remove(socketId);
    return user;
  }
  for (var roomName of this.rooms.keys()) {
    var user = this.rooms.get(roomName).users.get(socketId);
    if (user) {
      this.rooms.get(roomName).sockets.remove(socketId);
      this.rooms.get(roomName).users.remove(socketId);
      return user.user;
    }
  }
};

/**
 * This method returns a JSON object representation of the lobby that gets
 * sent to the client.
 * @return {Object}
 */
Lobby.prototype.getStatePacket = function() {
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
