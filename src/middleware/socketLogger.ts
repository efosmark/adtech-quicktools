import { Request, Response, NextFunction } from 'express';
import WebSocket, { WebSocketServer } from "ws";
import https from 'https';

const createSocketServer = (httpsServer: https.Server | undefined, opts?: object) => {
    const clients = new Set<WebSocket>();
    const server = new WebSocketServer({ server: httpsServer, ...opts });
    server.on('connection', (socket: WebSocket) => {
        socket.on('close', () => clients.delete(socket));
        clients.add(socket);
    });

    const sendToAll = (data: any) => {
        const stringData = JSON.stringify(data);
        clients.forEach(socket => socket.send(stringData));
    }

    console.debug("Socket server is waiting for connections...");
    return { server, clients, sendToAll };
}

export default (httpsServer?: https.Server) => {
    const socketServer = createSocketServer(httpsServer);

    // Return a middleware compatible with express
    return (req: Request, res: Response, next: NextFunction): void => {
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
