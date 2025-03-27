import { Request, Response, NextFunction } from 'express';
export interface AttributionSource {
    source_event_id: string;
    destination: string;
    source_type?: "navigation" | "event";
    expiry?: number;
    priority?: number;
    filter_data?: Record<string, string[]>;
    aggregation_keys?: Record<string, string>;
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
/**
 * Build an Express-compatible middleware for handling source registration.
 *
 * @param handler ARARegisterSourceHandler Handler gets executed when getting a request to register a source.
 * @param opts (Optional) { logRequests: boolean }
 */
export declare function onRegisterSource(handler: RegisterSourceHandler): (req: Request, res: Response, next: NextFunction) => void;
export declare function onRegisterTrigger(handler: RegisterTriggerHandler): (req: Request, res: Response, next: NextFunction) => void;
declare const _default: {
    onRegisterSource: typeof onRegisterSource;
    onRegisterTrigger: typeof onRegisterTrigger;
};
export default _default;
//# sourceMappingURL=ara.d.ts.map