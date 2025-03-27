import { Request, Response, NextFunction } from 'express';
export type BiddingSignalsHandler = (signals: BiddingSignalsRequest, req: Request, res: Response) => BiddingSignalsResponse | null;
export type ScoringSignalsHandler = (signals: ScoringSignalsRequest, req: Request, res: Response) => ScoringSignalsResponse | null;
export declare function biddingSignalsHandler(handler: BiddingSignalsHandler): (req: Request, res: Response, next: NextFunction) => void;
export declare function scoringSignalsHandler(handler: ScoringSignalsHandler): (req: Request, res: Response, next: NextFunction) => void;
declare const _default: {
    biddingSignalsHandler: typeof biddingSignalsHandler;
    scoringSignalsHandler: typeof scoringSignalsHandler;
};
export default _default;
//# sourceMappingURL=byos.d.ts.map