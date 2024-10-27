"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws");
var ws_1 = require("ws");
var http = require("http");
var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' request from ' + request.url);
    response.end('Hi there');
});
var wss = new ws_1.WebSocketServer({ server: server });
var clientIdCounter = 0;
var clients = new Map();
// Function to broadcast the current online user count  
function broadcastOnlineCount() {
    var onlineCount = clients.size; // Get the count of connected clients  
    clients.forEach(function (client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send("Online Users Count: ".concat(onlineCount));
        }
    });
}
wss.on('connection', function connection(ws) {
    var clientId = clientIdCounter++;
    clients.set(clientId, ws);
    console.log("Client ".concat(clientId, " connected."));
    // Send a welcome message with the client ID  
    ws.send("New client connected with ID: ".concat(clientId));
    // Broadcast the current online count to all clients  
    broadcastOnlineCount();
    ws.on('message', function message(msg) {
        // Broadcast the received message to all connected clients  
        var broadcastMessage = "".concat(clientId, " says: ").concat(msg);
        clients.forEach(function (client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(broadcastMessage);
            }
        });
    });
    ws.on('close', function () {
        console.log("Client ".concat(clientId, " disconnected."));
        clients.delete(clientId);
        // Broadcast the new online count to all clients  
        broadcastOnlineCount();
    });
});
server.listen(8080, function () {
    console.log((new Date()) + ' server is listening on port 8080');
});
