const HEADER_KV_FORMAT_VERSION = 'X-Fledge-Bidding-Signals-Format-Version';
export function biddingSignalsHandler(handler) {
    return (req, res, next) => {
        const hostnameParam = req.query.hostname?.toString() || '';
        const keysParam = req.query.hostname?.toString() || '';
        const interestGroupNamesParam = req.query.hostname?.toString() || '';
        const biddingSignalsRequest = {
            hostname: hostnameParam,
            keys: keysParam ? keysParam.split(',').map(k => k.trim()) : [],
            interestGroupNames: interestGroupNamesParam.split(',').map(k => k.trim()),
        };
        const response = handler(biddingSignalsRequest, req, res);
        if (response) {
            res.setHeader(HEADER_KV_FORMAT_VERSION, "2");
            res.json(response);
        }
        next();
    };
}
export function scoringSignalsHandler(handler) {
    return (req, res, next) => {
        const renderUrls = req.query.renderUrls?.toString() || '';
        const experimentGroupId = req.query.experimentGroupId?.toString() || '';
        const adComponentRenderUrls = req.query.adComponentRenderUrls?.toString() || '';
        if (!renderUrls) {
            next("ScoringSignalsRequest rejected");
            return;
        }
        const scoringSignalsRequest = {
            renderUrls: renderUrls.split(',').map(k => k.trim()),
            adComponentRenderUrls: adComponentRenderUrls.split(',').map(k => k.trim()),
            experimentGroupId: experimentGroupId ? Number(experimentGroupId) : undefined,
        };
        const response = handler(scoringSignalsRequest, req, res);
        if (response) {
            res.setHeader(HEADER_KV_FORMAT_VERSION, "2");
            res.json(response);
        }
        next();
    };
}
export default {
    biddingSignalsHandler,
    scoringSignalsHandler
};
