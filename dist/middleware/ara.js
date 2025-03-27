const HEADER_ARA_ELIGIBLE = 'Attribution-Reporting-Eligible';
const HEADER_ARA_REGISTER_SOURCE = 'Attribution-Reporting-Register-Source';
const HEADER_ARA_REGISTER_TRIGGER = 'Attribution-Reporting-Register-Trigger';
/**
 * Build an Express-compatible middleware for handling source registration.
 *
 * @param handler ARARegisterSourceHandler Handler gets executed when getting a request to register a source.
 * @param opts (Optional) { logRequests: boolean }
 */
export function onRegisterSource(handler) {
    return (req, res, next) => {
        if (!req.get(HEADER_ARA_ELIGIBLE) || req.get(HEADER_ARA_ELIGIBLE).indexOf('-source') === -1)
            return next();
        const eligibility = req.get(HEADER_ARA_ELIGIBLE).split(',').map(v => v.trim());
        if (eligibility.includes('event-source') || eligibility.includes('navigation-source')) {
            const response = handler(eligibility, req, res);
            if (response) {
                res.setHeader(HEADER_ARA_REGISTER_SOURCE, JSON.stringify(response));
                // Since we're handling this event, we want to prevent subsequent middlewares from
                // overwriting our header.
                delete req.headers[HEADER_ARA_ELIGIBLE];
            }
        }
        else if (eligibility) {
            console.error(`[onRegisterSource] Unknown eligibility request value: ${eligibility}`);
        }
        next();
    };
}
export function onRegisterTrigger(handler) {
    return (req, res, next) => {
        if (!req.get(HEADER_ARA_ELIGIBLE) || req.get(HEADER_ARA_ELIGIBLE).indexOf('-trigger') === -1)
            return next();
        const eligibility = req.get(HEADER_ARA_ELIGIBLE).split(',').map(v => v.trim());
        ;
        if (eligibility.includes('event-trigger')) {
            const response = handler(eligibility, req, res);
            if (response) {
                res.setHeader(HEADER_ARA_REGISTER_TRIGGER, JSON.stringify(response));
            }
        }
        else if (eligibility) {
            console.error(`[onRegisterTrigger] Unknown eligibility request value: ${eligibility}`);
        }
        next();
    };
}
export default {
    onRegisterSource,
    onRegisterTrigger
};
