"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableCORS = void 0;
const HEADER_CORS = "Access-Control-Allow-Origin";
const HEADER_ALLOW_HEADERS = "Access-Control-Allow-Headers";
const HEADER_ALLOW_CREDENTIALS = "Access-Control-Allow-Credentials";
/**
 * Express-compatible middleware for enabling CORS.
 * If the request has an "Origin" header, it will bounce that back as the
 * allowed origin.
 */
const enableCORS = (req, res, next) => {
    const origin = req.get("Origin");
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
exports.default = { enableCORS: exports.enableCORS };
