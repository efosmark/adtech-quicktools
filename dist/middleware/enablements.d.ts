import { Request, Response, NextFunction } from 'express';
export declare const allowFencedFrame: (req: Request, res: Response, next: NextFunction) => void;
export declare const allowAdAuction: (req: Request, res: Response, next: NextFunction) => void;
declare const _default: {
    allowAdAuction: (req: Request, res: Response, next: NextFunction) => void;
    allowFencedFrame: (req: Request, res: Response, next: NextFunction) => void;
};
export default _default;
