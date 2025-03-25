"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableCORS = void 0;
var HEADER_CORS = "Access-Control-Allow-Origin";
var HEADER_ALLOW_HEADERS = "Access-Control-Allow-Headers";
var HEADER_ALLOW_CREDENTIALS = "Access-Control-Allow-Credentials";
var enableCORS = function (req, res, next) {
    var origin = req.get("Origin");
    if (origin) {
        res.setHeader(HEADER_CORS, origin);
        res.setHeader(HEADER_ALLOW_CREDENTIALS, 'true');
    }
    else {
        res.setHeader(HEADER_CORS, '*');
        res.setHeader(HEADER_ALLOW_HEADERS, '*');
    }
    next();
};
exports.enableCORS = enableCORS;
