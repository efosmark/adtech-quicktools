import { Request, Response, NextFunction } from 'express';

export interface AttributionSource {
    /**
     * Required. The ID of the source event.
     * This typically represents the ad or campaign that generated the source.
     */
    source_event_id: string;

    /**
     * Optional. The priority of the source.
     * Higher priority sources may be preferred during attribution.
     */
    priority?: number;

    /**
     * Optional. Expiration time for the source in seconds.
     * Defaults to a maximum of 30 days if not specified.
     */
    expiry?: number;

    /**
     * Required. The destination for the attribution.
     * This is usually the advertiser's domain where conversions are tracked.
     */
    destination: string;

    /**
     * Optional. Event-level reporting metadata.
     * Allows providing additional contextual information for event-level reports.
     */
    event_report_window?: number;

    /**
     * Optional. Aggregatable report metadata.
     * Provides additional metadata for aggregate-level reporting.
     */
    aggregate_report_window?: number;

    /**
     * Optional. Filters for limiting source registration.
     * These can include specific conditions like user properties or device types.
     */
    filter_data?: Record<string, string[]>;

    /**
     * Optional. Debugging information.
     * Typically used for diagnosing attribution reports during testing.
     */
    debug_key?: number;
}

export interface AttributionTrigger {
    /**
     * Required. The ID of the trigger event.
     * This identifies the specific conversion event for attribution.
     */
    trigger_event_id: string;

    /**
     * Optional. Priority value to determine the importance of the trigger.
     * Higher values indicate higher priority.
     */
    priority?: number;

    /**
     * Optional. Specifies a delay before reporting the trigger.
     * Measured in seconds.
     */
    report_delay?: number;

    /**
     * Required. The destination associated with the conversion.
     * Typically the advertiser's domain that should receive attribution reports.
     */
    destination: string;

    /**
     * Optional. Aggregatable report data.
     * Provides additional data for aggregate-level reports.
     */
    aggregatable_report_data?: Record<string, number>;

    /**
     * Optional. Filters to specify which sources are eligible for attribution.
     * Allows specifying criteria like campaign types or specific user groups.
     */
    filter_data?: Record<string, string[]>;

    /**
     * Optional. Debugging key for testing and verification.
     * Used to facilitate debugging during development.
     */
    debug_key?: number;
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