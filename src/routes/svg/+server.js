import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    ws.on('message', (data) => {
        wss.clients.forEach((client) => {
            client.send(data.toString());
        });
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Handle HTTP requests to this route
export function GET() {
    return new Response('WebSocket server running');
}