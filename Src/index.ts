import WebSocket,{ WebSocketServer } from 'ws';
import http from 'http'

const server = http.createServer(function(request: any, response:any) {
    console.log((new Date()) + 'request come from ' + request.url);
    response.end('Hi there')
});

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws){
    ws.on('error',console.error);

    ws.on('message', function message(data , isBinary){
        wss.clients.forEach(function each(client){
            if (client.readyState === WebSocket.OPEN){
                client.send(data,{binary:isBinary});
            }
        });
    });
    ws.send("Hello msg from server");
});

server.listen(8080, function(){
    console.log((new Date())+'server is listening on port  8080');

});

