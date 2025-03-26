import { Request, Response, NextFunction } from 'express';

const HEADER_ARA_ELIGIBLE = 'Attribution-Reporting-Eligible';
const HEADER_ARA_REGISTER_SOURCE = 'Attribution-Reporting-Register-Source';
const HEADER_ARA_REGISTER_TRIGGER = 'Attribution-Reporting-Register-Trigger';

export type ARARegisterSourceHandler = (req: Request, res: Response) => AttributionSource | null;
export type ARARegisterTriggerHandler = (req: Request, res: Response) => AttributionTrigger | null;


/**
 * Build an Express-compatible middleware for handling source registration.
 * 
 * @param handler ARARegisterSourceHandler Handler gets executed when getting a request to register a source.
 * @param opts (Optional) { logRequests: boolean } 
 */
export function onRegisterSource(handler: ARARegisterSourceHandler, opts: { logRequests: boolean } | null) {
    return (req: Request, res: Response, next: NextFunction): void => {
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

export function onRegisterTrigger(handler: ARARegisterTriggerHandler, opts: { logRequests: boolean } | null) {
    return (req: Request, res: Response, next: NextFunction): void => {
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
}