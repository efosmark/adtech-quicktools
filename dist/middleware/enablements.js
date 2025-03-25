"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowAdAuction = exports.allowFencedFrame = void 0;
var HEADER_LOADING_MODE = 'Supports-Loading-Mode';
var HEADER_AD_AUCTION_ALLOWED = 'Ad-Auction-Allowed';
var allowFencedFrame = function (req, res, next) {
    res.setHeader(HEADER_LOADING_MODE, 'fenced-frame');
    next();
};
exports.allowFencedFrame = allowFencedFrame;
var allowAdAuction = function (req, res, next) {
    res.setHeader(HEADER_AD_AUCTION_ALLOWED, 'true');
    next();
};
exports.allowAdAuction = allowAdAuction;
exports.default = { allowAdAuction: exports.allowAdAuction, allowFencedFrame: exports.allowFencedFrame };
