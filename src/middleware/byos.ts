import { Request, Response, NextFunction } from 'express';

const HEADER_KV_FORMAT_VERSION = 'X-Fledge-Bidding-Signals-Format-Version';

export type BiddingSignalsHandler = (signals: BiddingSignalsRequest, req: Request, res: Response) => BiddingSignalsResponse | null;
export type ScoringSignalsHandler = (signals: ScoringSignalsRequest, req: Request, res: Response) => ScoringSignalsResponse | null;

export function biddingSignalsHandler(handler: BiddingSignalsHandler) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const hostnameParam = req.query.hostname?.toString() || '';
        const keysParam = req.query.hostname?.toString() || '';
        const interestGroupNamesParam = req.query.hostname?.toString() || '';

        const biddingSignalsRequest: BiddingSignalsRequest = {
            hostname: hostnameParam,
            keys: keysParam ? keysParam.split(',').map(k => k.trim()) : [],
            interestGroupNames: interestGroupNamesParam.split(',').map(k => k.trim()),
        };

        const response = handler(biddingSignalsRequest, req, res);
        if (response) {
            res.setHeader(HEADER_KV_FORMAT_VERSION, "2")
            res.json(response);
        }

        next();
    };
}

export function scoringSignalsHandler(handler: ScoringSignalsHandler) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const renderUrls = req.query.renderUrls?.toString() || '';
        const experimentGroupId = req.query.experimentGroupId?.toString() || '';
        const adComponentRenderUrls = req.query.adComponentRenderUrls?.toString() || '';

        if (!renderUrls) {
            next("ScoringSignalsRequest rejected")
            return;
        }

        const scoringSignalsRequest: ScoringSignalsRequest = {
            renderUrls: renderUrls.split(',').map(k => k.trim()),
            adComponentRenderUrls: adComponentRenderUrls.split(',').map(k => k.trim()),
            experimentGroupId: experimentGroupId ? Number(experimentGroupId) : undefined,
        };

        const response = handler(scoringSignalsRequest, req, res);
        if (response) {
            res.setHeader(HEADER_KV_FORMAT_VERSION, "2")
            res.json(response);
        }

        next();
    };
}

