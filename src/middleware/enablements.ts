import { Request, Response, NextFunction } from 'express';

const HEADER_LOADING_MODE = 'Supports-Loading-Mode';
const HEADER_AD_AUCTION_ALLOWED = 'Ad-Auction-Allowed';

export const allowFencedFrame = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader(HEADER_LOADING_MODE, 'fenced-frame');
    next();
}

export const allowAdAuction = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader(HEADER_AD_AUCTION_ALLOWED, 'true');
    next();
}

