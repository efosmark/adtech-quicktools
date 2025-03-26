import { WebSocketServer } from "ws";
const createSocketServer = (httpsServer, opts) => {
    const clients = new Set();
    const server = new WebSocketServer({ server: httpsServer, ...opts });
    server.on('connection', (socket) => {
        socket.on('close', () => clients.delete(socket));
        clients.add(socket);
    });
    const sendToAll = (data) => {
        const stringData = JSON.stringify(data);
        clients.forEach(socket => socket.send(stringData));
    };
    console.debug("Socket server is waiting for connections...");
    return { server, clients, sendToAll };
};
export default (httpsServer) => {
    const socketServer = createSocketServer(httpsServer);
    // Return a middleware compatible with express
    return (req, res, next) => {
        socketServer.sendToAll({
            requestTime: Date.now() / 1000,
            url: req.url,
            method: req.method,
            host: req.hostname,
            headers: req.headers,
            originalUrl: req.originalUrl
        });
        next();
    };
};
