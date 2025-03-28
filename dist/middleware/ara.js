"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEADER_ARA_REGISTER_TRIGGER = exports.HEADER_ARA_REGISTER_SOURCE = exports.HEADER_ARA_ELIGIBLE = void 0;
exports.onRegisterSource = onRegisterSource;
exports.onRegisterTrigger = onRegisterTrigger;
const structured_headers_1 = require("structured-headers");
exports.HEADER_ARA_ELIGIBLE = 'Attribution-Reporting-Eligible';
exports.HEADER_ARA_REGISTER_SOURCE = 'Attribution-Reporting-Register-Source';
exports.HEADER_ARA_REGISTER_TRIGGER = 'Attribution-Reporting-Register-Trigger';
function structuredItemsOfValue(dict, values) {
    return [...dict.keys()].filter(i => {
        return values.indexOf(i.toString()) > -1;
    });
}
/**
 * Build an Express-compatible middleware for handling source registration.
 *
 * @param handler ARARegisterSourceHandler Handler gets executed when getting a request to register a source.
 * @param opts (Optional) { logRequests: boolean }
 */
function onRegisterSource(handler) {
    return (req, res, next) => {
        if (!req.get(exports.HEADER_ARA_ELIGIBLE) || req.get(exports.HEADER_ARA_ELIGIBLE).indexOf('-source') === -1)
            return next();
        console.debug(`[onRegisterSource] HEADER=${req.get(exports.HEADER_ARA_ELIGIBLE)}`);
        try {
            const eligibility = (0, structured_headers_1.parseDictionary)(req.get(exports.HEADER_ARA_ELIGIBLE));
            console.log(eligibility);
            const sourceItems = structuredItemsOfValue(eligibility, ["event-source", "navigation-source"]);
            if (sourceItems.length > 0) {
                const response = handler(sourceItems, req, res);
                if (response) {
                    res.setHeader(exports.HEADER_ARA_REGISTER_SOURCE, JSON.stringify(response));
                }
            }
            else if (eligibility) {
                console.error(`[onRegisterSource] Unknown eligibility request value: ${eligibility}`);
            }
        }
        catch (e) {
            console.error(e);
        }
        next();
    };
}
function onRegisterTrigger(handler) {
    return (req, res, next) => {
        if (!req.get(exports.HEADER_ARA_ELIGIBLE) || req.get(exports.HEADER_ARA_ELIGIBLE).indexOf('trigger') === -1)
            return next();
        console.debug(`[onRegisterTrigger] HEADER=${req.get(exports.HEADER_ARA_ELIGIBLE)}`);
        try {
            const eligibility = (0, structured_headers_1.parseDictionary)(req.get(exports.HEADER_ARA_ELIGIBLE));
            console.log('eligibility', eligibility);
            const triggerItems = structuredItemsOfValue(eligibility, ["trigger", "event-trigger"]);
            console.log('triggerItems=', triggerItems);
            if (triggerItems.length > 0) {
                const response = handler(triggerItems, req, res);
                if (response) {
                    res.setHeader(exports.HEADER_ARA_REGISTER_TRIGGER, JSON.stringify(response));
                }
            }
            else if (eligibility) {
                console.error(`[onRegisterTrigger] Unknown eligibility request value: ${eligibility}`);
            }
        }
        catch (e) {
            console.error(e);
        }
        next();
    };
}
exports.default = {
    onRegisterSource,
    onRegisterTrigger
};
