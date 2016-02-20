# Equilibrium

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
  npm, bower and gulp should be installed globally on your system.
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
