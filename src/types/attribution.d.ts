
interface AttributionSource {

    // Unique ID for the attribution source. Limit 64 bytes.
    source_event_id?: string;

    // The destination site where conversions are expected
    destination: string;

    // The endpoint to receive attribution reports
    reporting_origin: string;

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



interface AttributionTrigger {
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