# Equilibrium
Equilibrium is a multiplayer game of physics, forces, and weight. To play,
join a room with another player and start a game. Every object in the game
world has a certain amount of weight. As a player, you can choose to push
or pull objects.
* * *
  - Pushing an object heavier than you will push you away from the object.
  - Pushing an object lighter than you will push the object away from you.
  - Pulling an object heavier than you will pull you towards the object.
  - Pulling an object lighter than you will pull the object towards you.

* * *
If you are able to hit another player with an object at high velocity, you
will do damage to them. The goal of the game is to be able to kill the other
player by hitting them while dodging away from their projectiles.

# Technical:
  - Made with NodeJS and Socket.IO
  - The states of all the objects are all instantiated, updated, and managed
  server side. All calculations are done server side.
  - The client merely sends intents to the server, which are processed. The
  server returns a series of JSON objects that hold the state of the world to
  the client for rendering.
  - The server holds authoritative determination over the positions and states
  of all the objects.

# Setting Up:
  This project requires node version 0.12 or greater.
  npm, bower, and gulp should be installed globally on your system.
  ```
  npm install
  bower install
  gulp
  ```
  The project Gulpfile already has a few custom processes to run.
  ```bash
  gulp            # will compile the JS and LESS assets

  gulp js         # will compile only the JS assets

  gulp less       # will compile only the LESS assets

  gulp watch      # will watch the JS and LESS assets and compile them when
                  # they are modified, recommended during development

  gulp watch-js   # will only watch the JS assets

  gulp watch-less # will only watch the LESS assets
  ```

# Creators:
  - Alvin Lin (omgimanerd)
  - Kenneth Li (noobbyte)

&copy; 2016 Penumbra Games
