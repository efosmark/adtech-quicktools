
/**
 * Bring-your-own-server KV service interface
 * 
 * Documentation source: https://github.com/WICG/turtledove/blob/main/FLEDGE.md#31-fetching-real-time-data-from-a-trusted-server
 */

interface InterestGroupData {

    /**
     * The `priorityVector` will be used to calculate the final priority for 
     * an interest group, if that interest group has 
     * `enableBiddingSignalsPrioritization` set to `true` in its definition. 
     * Otherwise, it's only used to filter out interest groups, if the dot 
     * product with `prioritySignals` is negative.
     */
    priorityVector?: Record<string, number>;

    /**
     * The `updateIfOlderThanMs` optional field specifies that the interest 
     * group should be updated via the updateURL mechanism (see the interest 
     * group attributes section) if the interest group hasn't been joined or 
     * updated in a duration of time exceeding `updateIfOlderThanMs` 
     * milliseconds. Updates that ended in failure, either parse or network 
     * failure, are not considered to increment the last update or join time. 
     * An `updateIfOlderThanMs` that's less than 10 minutes will be clamped 
     * to 10 minutes.
     */
    updateIfOlderThanMs?: number;
}

interface BiddingSignalsResponse {
    keys: Record<string, object>;

    /**
     * The `perInterestGroupData` dictionary contains optional data for 
     * interest groups whose names were included in the request URL. 
     */
    perInterestGroupData?: Record<string, InterestGroupData>;
}

/**
 * Width and height are the normalized width and height from the `requestedSize`
 * of the (component) auction's `AuctionConfig`. "Normalized" means units are 
 * always appended, and trailing zeros are removed, so 
 * `{width: "62.50sw", height: "10.0"}` becomes "62.5sw,10px". 
 */
interface SlotSize {
    width: string;
    height: string;
}

interface BiddingSignalsRequest {

    /**
     * The hostname of the top-level webpage where the ad will appear.
     * Provided by the browser.
     */
    hostname: string;

    /** 
     * List of `trustedBiddingSignalsKeys` as strings.
     */
    keys: string[];

    /**
     * List of the names of the interest groups for which the data is being 
     * fetched.
     */
    interestGroupNames: string[];

    /** 
     * From `perBuyerExperimentGroupIds` if provided.
     */
    experimentGroupId?: number;

    /**
     * Available when `trustedBiddingSignalsSlotSizeMode` is "slot-size".
     */
    slotSize?: SlotSize;

    /**
     * Available when `trustedBiddingSignalsSlotSizeMode` is set to 
     * "all-slots-requested-sizes".
     * All sizes are taken from the (component) auction's 
     * `allSlotsRequestedSizes` value. 
     */
    allSlotsRequestedSizes?: SlotSize[];

}

/*
The request base URL is set from the trustedScoringSignalsURL property of the 
seller's auction configuration object. 

The parameter experimentGroupId comes from sellerExperimentGroupId in the auction configuration if provided. 
However, the URL has two sets of keys: 
"renderUrls=url1,url2,..." and "adComponentRenderUrls=url1,url2,..." 
for the main and adComponent renderURLs bids offered in the auction. 

Note that the query params use "Urls" instead of "URLs". It is up to the client how and whether to aggregate 
the fetches with the URLs of multiple bidders.
*/

interface ScoringSignalsRequest {
    experimentGroupId?: number;
    renderUrls: string[];
    adComponentRenderUrls?: string[];
}

interface ScoringSignalsResponse {
    renderURLs?: Record<string, object>;
    adComponentRenderUrls?: Record<string, object>;
}