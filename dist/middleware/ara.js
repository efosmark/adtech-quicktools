"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRegisterSource = onRegisterSource;
exports.onRegisterTrigger = onRegisterTrigger;
var HEADER_ARA_ELIGIBLE = 'Attribution-Reporting-Eligible';
var HEADER_ARA_REGISTER_SOURCE = 'Attribution-Reporting-Register-Source';
var HEADER_ARA_REGISTER_TRIGGER = 'Attribution-Reporting-Register-Trigger';
function onRegisterSource(handler, opts) {
    return function (req, res, next) {
        var eligibility = req.get(HEADER_ARA_ELIGIBLE);
        if (eligibility === 'event-source' || eligibility === 'navigation-source') {
            if (opts === null || opts === void 0 ? void 0 : opts.logRequests) {
                console.debug("ARA Register Source: ".concat(req.path));
            }
            var response = handler(req, res);
            if (response) {
                res.setHeader(HEADER_ARA_REGISTER_SOURCE, JSON.stringify(response));
            }
        }
        next();
    };
}
function onRegisterTrigger(handler, opts) {
    return function (req, res, next) {
        var eligibility = req.get(HEADER_ARA_ELIGIBLE);
        if (eligibility === 'event-trigger') {
            if (opts === null || opts === void 0 ? void 0 : opts.logRequests) {
                console.debug("ARA Register Trigger: ".concat(req.path));
            }
            var response = handler(req, res);
            if (response) {
                res.setHeader(HEADER_ARA_REGISTER_TRIGGER, JSON.stringify(response));
            }
        }
        next();
    };
}
exports.default = {
    onRegisterSource: onRegisterSource,
    onRegisterTrigger: onRegisterTrigger
};
