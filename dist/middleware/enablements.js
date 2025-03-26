const HEADER_LOADING_MODE = 'Supports-Loading-Mode';
const HEADER_AD_AUCTION_ALLOWED = 'Ad-Auction-Allowed';
export const allowFencedFrame = (req, res, next) => {
    res.setHeader(HEADER_LOADING_MODE, 'fenced-frame');
    next();
};
export const allowAdAuction = (req, res, next) => {
    res.setHeader(HEADER_AD_AUCTION_ALLOWED, 'true');
    next();
};
export default { allowAdAuction, allowFencedFrame };
