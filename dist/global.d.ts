

interface AuctionAdInterestGroupKey {
    owner: string;
    name: string;
}

interface AuctionAd {
    renderURL: string;

    sizeGroup?: string;
    metadata?: any;

    buyerReportingId?: string;
    buyerAndSellerReportingId?: string;
    selectableBuyerAndSellerReportingIds?: string[];
    allowedReportingOrigins?: string[];
    adRenderId?: string;
}

interface AuctionAdInterestGroupSize {
    width: string;
    height: string;
}

interface GenerateBidInterestGroup {
    owner: string;
    name: string;

    enableBiddingSignalsPrioritization?: boolean;
    priorityVector?: Record<string, number>;
    sellerCapabilities?: Record<string, string[]>;
    executionMode?: string;
    biddingLogicURL?: string;
    biddingWasmHelperURL?: string;
    updateURL?: string;
    trustedBiddingSignalsURL?: string;
    trustedBiddingSignalsKeys?: string[];
    trustedBiddingSignalsSlotSizeMode?: string;
    maxTrustedBiddingSignalsURLLength?: number;
    userBiddingSignals?: any;
    ads?: AuctionAd[];
    adComponents?: AuctionAd[];
    adSizes?: Record<string, AuctionAdInterestGroupSize>;
    sizeGroups?: Record<string, string[]>;
}

interface ProtectedAudiencePrivateAggregationConfig {
    aggregationCoordinatorOrigin: string;
}

interface AuctionAdInterestGroup extends GenerateBidInterestGroup {
    priority?: number;
    prioritySignalsOverrides?: Record<string, number>;
    lifetimeMs: number;
    additionalBidKey?: string;
    privateAggregationConfig?: ProtectedAudiencePrivateAggregationConfig
}

interface Worklet {
    run(...args): Promise<unknown>;
}

interface SharedStorage {
    createWorklet(...args): Promise<Worklet>;
    selectURL(...args): Promise<any>;
    worklet: {
        addModule(module: string): Promise<unknown>;
    }
}


declare global {
    type BiddingSignals = Record<string, any>;

    interface Window {
        sharedStorage: SharedStorage;
    }

    interface Document {
        featurePolicy: {
            allowsFeature: (feature: string) => boolean;
        }
    }

    interface Navigator {
        // https://wicg.github.io/turtledove/#joinadinterestgroup
        joinAdInterestGroup(group: AuctionAdInterestGroup): Promise<undefined>;

        //https://wicg.github.io/turtledove/#leaveadinterestgroup
        leaveAdInterestGroup(group: AuctionAdInterestGroupKey): Promise<undefined>;

        // https://wicg.github.io/turtledove/#clearoriginjoinedAdInterestGroups
        clearOriginJoinedAdInterestGroups(owner: string, interestGroupsToKeep?: string): Promise<undefined>;
    }

}

export { };