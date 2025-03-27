import { Request, Response, NextFunction } from 'express';

export interface AttributionSource {

    // Unique ID for the attribution source. Limit 64 bytes.
    source_event_id: string;

    // The destination site where conversions are expected
    destination: string;

    // The endpoint to receive attribution reports
    //reporting_origin: string;

    // Type of the source: navigation (click) or event (view)
    source_type?: "navigation" | "event";

    // Time in seconds before the source expires (default: 30 days)
    expiry?: number;

    // Determines priority for matching conversions
    priority?: number;

    // Key-value pairs for filtering reports
    filter_data?: Record<string, string[]>;

    // Defines keys for aggregated reporting
    aggregation_keys?: Record<string, string>;

    // Debugging key for testing
    debug_key?: string;
}



export interface AttributionTrigger {
    /** Data associated with the conversion event. Limited to 8 bytes. */
    trigger_data: string;

    /** The destination site where the conversion occurred */
    destination: string;

    /** The endpoint to receive attribution reports */
    reporting_origin: string;

    /** Determines priority for matching conversions (optional) */
    priority?: number;

    /** Key-value pairs for filtering reports (optional) */
    filters?: Record<string, string[]>;

    /** Key-value pairs to exclude from reporting (optional) */
    not_filters?: Record<string, string[]>;

    /** Defines keys for aggregated reporting (optional) */
    aggregation_keys?: Record<string, string>;

    /** Debugging key for testing (optional) */
    debug_key?: string;
}

export type RegisterSourceHandler = (eligibility: string[], req: Request, res: Response) => AttributionSource | void;
export type RegisterTriggerHandler = (eligibility: string[], req: Request, res: Response) => AttributionTrigger | void;

const HEADER_ARA_ELIGIBLE = 'Attribution-Reporting-Eligible';
const HEADER_ARA_REGISTER_SOURCE = 'Attribution-Reporting-Register-Source';
const HEADER_ARA_REGISTER_TRIGGER = 'Attribution-Reporting-Register-Trigger';

/**
 * Build an Express-compatible middleware for handling source registration.
 * 
 * @param handler ARARegisterSourceHandler Handler gets executed when getting a request to register a source.
 * @param opts (Optional) { logRequests: boolean } 
 */
export function onRegisterSource(handler: RegisterSourceHandler) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.get(HEADER_ARA_ELIGIBLE) || req.get(HEADER_ARA_ELIGIBLE).indexOf('-source') === -1) return next();

        const eligibility = req.get(HEADER_ARA_ELIGIBLE).split(',').map(v => v.trim());
        if (eligibility.includes('event-source') || eligibility.includes('navigation-source')) {
            const response = handler(eligibility, req, res);
            if (response) {
                res.setHeader(HEADER_ARA_REGISTER_SOURCE, JSON.stringify(response));
                // Since we're handling this event, we want to prevent subsequent middlewares from
                // overwriting our header.
                delete req.headers[HEADER_ARA_ELIGIBLE];
            }
        } else if (eligibility) {
            console.error(`[onRegisterSource] Unknown eligibility request value: ${eligibility}`)
        }
        next();
    };
}

export function onRegisterTrigger(handler: RegisterTriggerHandler) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.get(HEADER_ARA_ELIGIBLE) || req.get(HEADER_ARA_ELIGIBLE).indexOf('-trigger') === -1) return next();

        const eligibility = req.get(HEADER_ARA_ELIGIBLE).split(',').map(v => v.trim());;
        if (eligibility.includes('event-trigger')) {
            const response = handler(eligibility, req, res);
            if (response) {
                res.setHeader(HEADER_ARA_REGISTER_TRIGGER, JSON.stringify(response));
            }
        } else if (eligibility) {
            console.error(`[onRegisterTrigger] Unknown eligibility request value: ${eligibility}`)
        }
        next();
    };
}

export default {
    onRegisterSource,
    onRegisterTrigger
}