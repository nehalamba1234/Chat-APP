import * as WebSocket from 'ws';
import { WebSocketServer } from 'ws'; 

import * as http from 'http'; 

const server = http.createServer((request, response) => {  
    console.log((new Date()) + ' request come from ' + request.url);  
    response.end('Hi there');  
});  

const wss = new WebSocketServer({ server });  

let clientIdCounter = 0;  
const clients = new Map();  

wss.on('connection', function connection(ws) {  
    const clientId = clientIdCounter++;  
    clients.set(clientId, ws);  
    console.log(`Client ${clientId} connected.`);  

    // Send a welcome message with the client ID  
    ws.send(`New client Connected with Id as ${clientId}`);  

    ws.on('message', function message(msg) {  
        // Broadcast the message as `clientId msg`  
        const broadcastMessage = `${clientId} ${msg}`;  

        clients.forEach(function each(client) {  
            if (client.readyState === WebSocket.OPEN) {  
                client.send(broadcastMessage);  
            }  
        });  
    });  

    ws.on('close', function () {  
        console.log(`Client ${clientId} disconnected.`);  
        clients.delete(clientId);  
    });  
});  

server.listen(8080, () => {  
    console.log((new Date()) + ' server is listening on port 8080');  
});