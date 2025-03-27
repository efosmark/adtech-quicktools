import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to send Supports-Loading-Mode: fenced-frame
 */
export declare const allowFencedFrame: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to send Ad-Auction-Allowed: true
 */
export declare const allowAdAuction: (req: Request, res: Response, next: NextFunction) => void;
declare const _default: {
    allowAdAuction: (req: Request, res: Response, next: NextFunction) => void;
    allowFencedFrame: (req: Request, res: Response, next: NextFunction) => void;
};
export default _default;
//# sourceMappingURL=enablements.d.ts.map