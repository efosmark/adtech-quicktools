"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ara_1 = __importDefault(require("./middleware/ara"));
var byos_1 = __importDefault(require("./middleware/byos"));
var cors_1 = __importDefault(require("./middleware/cors"));
var enablements_1 = __importDefault(require("./middleware/enablements"));
var favicon_1 = __importDefault(require("./middleware/favicon"));
var permissions_1 = __importDefault(require("./middleware/permissions"));
var socketLogger_1 = __importDefault(require("./middleware/socketLogger"));
exports.default = {
    ara: ara_1.default,
    byos: byos_1.default,
    cors: cors_1.default,
    enablements: enablements_1.default,
    favicon: favicon_1.default,
    permissions: permissions_1.default,
    socketLogger: socketLogger_1.default,
};
