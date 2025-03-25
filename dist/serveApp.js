"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = __importDefault(require("https"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
exports.default = (function (_a) {
    var port = _a.port, hostname = _a.hostname, app = _a.app, buildApp = _a.buildApp, key = _a.key, cert = _a.cert, httpsServer = _a.httpsServer;
    if (!app && !buildApp)
        throw new Error("Must have supplied an app or an app building function.");
    if (!httpsServer)
        httpsServer = https_1.default.createServer({
            key: fs_1.default.readFileSync(path_1.default.join(__dirname, key)),
            cert: fs_1.default.readFileSync(path_1.default.join(__dirname, cert))
        });
    if (!app && buildApp)
        app = buildApp((0, express_1.default)(), { port: port, hostname: hostname, key: key, cert: cert, httpsServer: httpsServer });
    if (!app)
        throw new Error("No app defined.");
    httpsServer.addListener("request", app);
    httpsServer.listen(port, hostname, function () {
        console.log("App is running at https://".concat(hostname, ":").concat(port));
    });
    return httpsServer;
});
