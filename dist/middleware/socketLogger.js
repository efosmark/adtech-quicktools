"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var createSocketServer = function (httpsServer, opts) {
    var clients = new Set();
    var server = new ws_1.WebSocketServer(__assign({ server: httpsServer }, opts));
    server.on('connection', function (socket) {
        socket.on('close', function () { return clients.delete(socket); });
        clients.add(socket);
    });
    var sendToAll = function (data) {
        var stringData = JSON.stringify(data);
        clients.forEach(function (socket) { return socket.send(stringData); });
    };
    console.debug("Socket server is waiting for connections...");
    return { server: server, clients: clients, sendToAll: sendToAll };
};
exports.default = (function (httpsServer) {
    var socketServer = createSocketServer(httpsServer);
    // Return a middleware compatible with express
    return function (req, res, next) {
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
});
