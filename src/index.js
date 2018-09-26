import onMessage from './handlers/onMessage';

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

  // TODO : Check if they are coming from our website
  const connection = request.accept(null, request.origin);

  console.log(`${new Date()} Connection accepted.`);

  connection.on('message', onMessage);

  // user disconnected
  connection.on('close', (socket) => {
    console.warn('Someone Disconnected', socket);
  });
});
