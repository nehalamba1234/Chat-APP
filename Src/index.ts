import * as WebSocket from 'ws';  
import { WebSocketServer } from 'ws';   
import * as http from 'http';   

const server = http.createServer((request, response) => {  
    console.log((new Date()) + ' request from ' + request.url);  
    response.end('Hi there');  
});  

const wss = new WebSocketServer({ server });  

let clientIdCounter = 0;  
const clients = new Map();  

// Function to broadcast the current online user count  
function broadcastOnlineCount() {  
    const onlineCount = clients.size; // Get the count of connected clients  
    console.log("Broadcasting online count:", onlineCount);
    clients.forEach((client) => {  
        if (client.readyState === WebSocket.OPEN) {  
            client.send(`Online Users Count: ${onlineCount}`);  
        }  
    });  
}  

wss.on('connection', function connection(ws) {  
    const clientId = clientIdCounter++;  
    clients.set(clientId, ws);  
    console.log(`Client ${clientId} connected.`);  

    // Send a welcome message with the client ID  
    ws.send(`New client connected with ID: ${clientId}`);  

    // Broadcast the current online count to all clients  
    broadcastOnlineCount();  

    ws.on('message', function message(msg) {  
        // Broadcast the received message to all connected clients  
        const broadcastMessage = `${clientId} says: ${msg}`;  

        clients.forEach((client) => {  
            if (client.readyState === WebSocket.OPEN) {  
                client.send(broadcastMessage);  
            }  
        });  
    });  

    ws.on('close', function () {  
        console.log(`Client ${clientId} disconnected.`);  
        clients.delete(clientId);  
        
        // Broadcast the new online count to all clients  
        broadcastOnlineCount();  
    });  
});  

server.listen(8080, () => {  
    console.log((new Date()) + ' server is listening on port 8080');  
});