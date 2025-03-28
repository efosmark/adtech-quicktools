"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowAdAuction = exports.allowFencedFrame = void 0;
const HEADER_LOADING_MODE = 'Supports-Loading-Mode';
const HEADER_AD_AUCTION_ALLOWED = 'Ad-Auction-Allowed';
/**
 * Middleware to send Supports-Loading-Mode: fenced-frame
 */
const allowFencedFrame = (req, res, next) => {
    res.setHeader(HEADER_LOADING_MODE, 'fenced-frame');
    next();
};
exports.allowFencedFrame = allowFencedFrame;
/**
 * Middleware to send Ad-Auction-Allowed: true
 */
const allowAdAuction = (req, res, next) => {
    res.setHeader(HEADER_AD_AUCTION_ALLOWED, 'true');
    next();
};
exports.allowAdAuction = allowAdAuction;
exports.default = { allowAdAuction: exports.allowAdAuction, allowFencedFrame: exports.allowFencedFrame };
