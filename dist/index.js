"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ara_1 = __importDefault(require("./middleware/ara"));
const byos_1 = __importDefault(require("./middleware/byos"));
const cors_1 = __importDefault(require("./middleware/cors"));
const enablements_1 = __importDefault(require("./middleware/enablements"));
const favicon_1 = __importDefault(require("./middleware/favicon"));
const permissions_1 = __importDefault(require("./middleware/permissions"));
const socketLogger_1 = __importDefault(require("./middleware/socketLogger"));
const serve_1 = __importDefault(require("./serve"));
exports.default = {
    ara: ara_1.default,
    byos: byos_1.default,
    cors: cors_1.default,
    enablements: enablements_1.default,
    favicon: favicon_1.default,
    permissions: permissions_1.default,
    socketLogger: socketLogger_1.default,
    serve: serve_1.default
};
