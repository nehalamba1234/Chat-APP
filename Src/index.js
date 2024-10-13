"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws");
var ws_1 = require("ws");
var http = require("http");
var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' request come from ' + request.url);
    response.end('Hi there');
});
var wss = new ws_1.WebSocketServer({ server: server });
var clientIdCounter = 0;
var clients = new Map();
wss.on('connection', function connection(ws) {
    var clientId = clientIdCounter++;
    clients.set(clientId, ws);
    console.log("Client ".concat(clientId, " connected."));
    // Send a welcome message with the client ID  
    ws.send("Your client ID is ".concat(clientId));
    ws.on('message', function message(msg) {
        // Broadcast the message as `clientId msg`  
        var broadcastMessage = "".concat(clientId, " ").concat(msg);
        clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(broadcastMessage);
            }
        });
    });
    ws.on('close', function () {
        console.log("Client ".concat(clientId, " disconnected."));
        clients.delete(clientId);
    });
});
server.listen(8080, function () {
    console.log((new Date()) + ' server is listening on port 8080');
});
