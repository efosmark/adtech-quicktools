const HEADER_ARA_ELIGIBLE = 'Attribution-Reporting-Eligible';
const HEADER_ARA_REGISTER_SOURCE = 'Attribution-Reporting-Register-Source';
const HEADER_ARA_REGISTER_TRIGGER = 'Attribution-Reporting-Register-Trigger';
export function onRegisterSource(handler, opts) {
    return (req, res, next) => {
        const eligibility = req.get(HEADER_ARA_ELIGIBLE);
        if (eligibility === 'event-source' || eligibility === 'navigation-source') {
            if (opts?.logRequests) {
                console.debug(`ARA Register Source: ${req.path}`);
            }
            const response = handler(req, res);
            if (response) {
                res.setHeader(HEADER_ARA_REGISTER_SOURCE, JSON.stringify(response));
            }
        }
        next();
    };
}
export function onRegisterTrigger(handler, opts) {
    return (req, res, next) => {
        const eligibility = req.get(HEADER_ARA_ELIGIBLE);
        if (eligibility === 'event-trigger') {
            if (opts?.logRequests) {
                console.debug(`ARA Register Trigger: ${req.path}`);
            }
            const response = handler(req, res);
            if (response) {
                res.setHeader(HEADER_ARA_REGISTER_TRIGGER, JSON.stringify(response));
            }
        }
        next();
    };
}
export default {
    onRegisterSource,
    onRegisterTrigger
};
