import upload from './handlers/upload';
import stream from './handlers/stream';

process.title = 'vlocc-holder-software';

const webSocketsServerPort = 1337;

const WebSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer((request, response) => {
  // Not important for us. We're writing WebSocket server,
  // not HTTP server
});

server.listen(webSocketsServerPort, () => {
  console.log(`${new Date()} Server is listening on port ${webSocketsServerPort}`);
});


const wsServer = new WebSocketServer({
  httpServer: server
});

// The function passed is called on every connection
wsServer.on('request', (request) => {
  console.log(`${new Date()} Connection from origin ${request.origin}.`);
  console.log(request.requestedProtocols);

  let connection;
  const uploadInformation = {};

  switch (request.requestedProtocols[0]) {
    case 'upload':
      connection = request.accept('upload', request.origin);
      connection.on('message', (data) => {
        upload(data, uploadInformation);
      });
      console.log(`${new Date()} upload Connection accepted.`);
      break;

    case 'stream':
      connection = request.accept('stream', request.origin);
      connection.on('message', (data) => {
        stream(data, connection);
      });
      console.log(`${new Date()} stream Connection accepted.`);
      break;
    default:
      request.reject();
      console.log(`${new Date()} Connection rejected, Incorrect protocol.`);
  }

  connection.on('error', (e) => {
    console.log(e);
  });

  // user disconnected
  connection.on('close', (socket) => {
    console.warn('Someone Disconnected', socket);
  });
});
