"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.biddingSignalsHandler = biddingSignalsHandler;
exports.scoringSignalsHandler = scoringSignalsHandler;
var HEADER_KV_FORMAT_VERSION = 'X-Fledge-Bidding-Signals-Format-Version';
function biddingSignalsHandler(handler) {
    return function (req, res, next) {
        var _a, _b, _c;
        var hostnameParam = ((_a = req.query.hostname) === null || _a === void 0 ? void 0 : _a.toString()) || '';
        var keysParam = ((_b = req.query.hostname) === null || _b === void 0 ? void 0 : _b.toString()) || '';
        var interestGroupNamesParam = ((_c = req.query.hostname) === null || _c === void 0 ? void 0 : _c.toString()) || '';
        var biddingSignalsRequest = {
            hostname: hostnameParam,
            keys: keysParam ? keysParam.split(',').map(function (k) { return k.trim(); }) : [],
            interestGroupNames: interestGroupNamesParam.split(',').map(function (k) { return k.trim(); }),
        };
        var response = handler(biddingSignalsRequest, req, res);
        if (response) {
            res.setHeader(HEADER_KV_FORMAT_VERSION, "2");
            res.json(response);
        }
        next();
    };
}
function scoringSignalsHandler(handler) {
    return function (req, res, next) {
        var _a, _b, _c;
        var renderUrls = ((_a = req.query.renderUrls) === null || _a === void 0 ? void 0 : _a.toString()) || '';
        var experimentGroupId = ((_b = req.query.experimentGroupId) === null || _b === void 0 ? void 0 : _b.toString()) || '';
        var adComponentRenderUrls = ((_c = req.query.adComponentRenderUrls) === null || _c === void 0 ? void 0 : _c.toString()) || '';
        if (!renderUrls) {
            next("ScoringSignalsRequest rejected");
            return;
        }
        var scoringSignalsRequest = {
            renderUrls: renderUrls.split(',').map(function (k) { return k.trim(); }),
            adComponentRenderUrls: adComponentRenderUrls.split(',').map(function (k) { return k.trim(); }),
            experimentGroupId: experimentGroupId ? Number(experimentGroupId) : undefined,
        };
        var response = handler(scoringSignalsRequest, req, res);
        if (response) {
            res.setHeader(HEADER_KV_FORMAT_VERSION, "2");
            res.json(response);
        }
        next();
    };
}
exports.default = {
    biddingSignalsHandler: biddingSignalsHandler,
    scoringSignalsHandler: scoringSignalsHandler
};
