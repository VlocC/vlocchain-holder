"use strict";

process.title = 'vlocc-holder-software';

const webSocketsServerPort = 1337;

const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer(function(request, response) {
  // Not important for us. We're writing WebSocket server,
  // not HTTP server
});

server.listen(webSocketsServerPort, function() {
  console.log((new Date()) + " Server is listening on port "
      + webSocketsServerPort);
});


const wsServer = new webSocketServer({
  httpServer: server
});

// The function passed is called on every connection
wsServer.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin '
      + request.origin + '.');

  // TODO : Check if they are coming from our website
  let connection = request.accept(null, request.origin);

  console.log((new Date()) + ' Connection accepted.');

  // user is going to send the video file
  connection.on('upload', function(message) {

  });

  // user is sending information about themself and video
  connection.on('information', function(message) {

  });

  // user disconnected
  connection.on('close', function(connection) {
    console.warn("Someone Disconnected")
  });
});
