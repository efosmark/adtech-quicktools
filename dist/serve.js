"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newServer = exports.conf = void 0;
exports.default = serveApp;
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cert_1 = require("./cert");
const serve_static_1 = __importDefault(require("serve-static"));
const morgan_1 = __importDefault(require("morgan"));
morgan_1.default.token('host', (req) => req.get('host') || 'unknown-host');
exports.conf = {
    defaultLogger: (0, morgan_1.default)(':status :method :host :url'),
    certRootPath: path_1.default.join(__dirname, 'ssl'),
    staticRootPath: path_1.default.join(path_1.default.dirname(require.main.filename), 'static')
};
const newServer = (hostname, useHttps) => {
    if (useHttps !== false) {
        if (!fs_1.default.existsSync(exports.conf.certRootPath))
            fs_1.default.mkdirSync(exports.conf.certRootPath, { recursive: true });
        const certPath = path_1.default.join(exports.conf.certRootPath, `${hostname}.pem`);
        const keyPath = path_1.default.join(exports.conf.certRootPath, `${hostname}-key.pem`);
        (0, cert_1.setupCertificate)(certPath, keyPath, hostname);
        return https_1.default.createServer({
            key: fs_1.default.readFileSync(keyPath),
            cert: fs_1.default.readFileSync(certPath)
        });
    }
    return http_1.default.createServer();
};
exports.newServer = newServer;
async function serveApp({ port, hostname, buildApp, https: useHttps, logger, staticPath }) {
    const server = (0, exports.newServer)(hostname, useHttps);
    const app = buildApp((0, express_1.default)(), { port, hostname, https: useHttps !== false, server });
    if (staticPath !== false) {
        const p = staticPath ?? path_1.default.join(exports.conf.staticRootPath, hostname);
        console.debug(`[serveApp] Looking for static path: ${p}`);
        if (fs_1.default.existsSync(p)) {
            console.debug(`[serveApp] Static path found. Automatically serving static resources.`);
            app.use((0, serve_static_1.default)(p));
        }
    }
    if (!logger && exports.conf.defaultLogger)
        app.use(exports.conf.defaultLogger);
    else if (logger)
        app.use(logger);
    server.addListener("request", app);
    server.listen(port, hostname, () => {
        console.log(`App is running at http${useHttps !== false ? 's' : ''}://${hostname}:${port}`);
    });
    return server;
}
serveApp.configure = (overrides) => {
    Object.assign(exports.conf, overrides);
};
