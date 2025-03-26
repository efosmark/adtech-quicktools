import { Request, Response, NextFunction } from 'express';

const HEADER_LOADING_MODE = 'Supports-Loading-Mode';
const HEADER_AD_AUCTION_ALLOWED = 'Ad-Auction-Allowed';

/**
 * Middleware to send Supports-Loading-Mode: fenced-frame 
 */
export const allowFencedFrame = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader(HEADER_LOADING_MODE, 'fenced-frame');
    next();
}

/**
 * Middleware to send Ad-Auction-Allowed: true
 */
export const allowAdAuction = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader(HEADER_AD_AUCTION_ALLOWED, 'true');
    next();
}

export default { allowAdAuction, allowFencedFrame };
