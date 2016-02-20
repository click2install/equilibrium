/**
 * This is the app script that is run on the server.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var DEV_MODE = false;
var FRAME_RATE = 1000.0 / 60.0;
var IP = process.env.IP || 'localhost';
var PORT_NUMBER = process.env.PORT || 5000;

process.argv.forEach(function(value, index, array) {
  if (value == '--dev' || value == '-dev' ||
      value == '--development' || value == '-development') {
    DEV_MODE = true;
  }
});

// Dependencies.
var express = require('express');
var http = require('http');
var morgan = require('morgan');
var socketIO = require('socket.io');
var swig = require('swig');

// Initialization.
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.engine('html', swig.renderFile);

app.set('port', PORT_NUMBER);
app.set('view engine', 'html');

app.use(morgan(':date[web] :method :url :req[header] :remote-addr :status'));
app.use('/bower_components',
        express.static(__dirname + '/bower_components'));
app.use('/static',
        express.static(__dirname + '/static'));
app.use('/shared',
        express.static(__dirname + '/shared'));

// Routing
app.get('/', function(request, response) {
  response.render('index.html', {
    dev_mode: DEV_MODE
  });
});

// Websocket handling
io.on('connection', function(socket) {
});

// Server side game loop, runs at 60Hz and sends out update packets to all
// clients every tick.
setInterval(function() {
  
}, FRAME_RATE);

// Starts the server.
server.listen(PORT_NUMBER, function() {
  console.log('STARTING SERVER ON PORT ' + PORT_NUMBER);
  if (DEV_MODE) {
    console.log('DEVELOPMENT MODE ENABLED: SERVING UNCOMPILED JAVASCRIPT!');
  }
});
