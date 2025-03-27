import { Request, Response, NextFunction } from 'express';
/**
 * Express-compatible middleware for enabling CORS.
 * If the request has an "Origin" header, it will bounce that back as the
 * allowed origin.
 */
export declare const enableCORS: (req: Request, res: Response, next: NextFunction) => void;
declare const _default: {
    enableCORS: (req: Request, res: Response, next: NextFunction) => void;
};
export default _default;
//# sourceMappingURL=cors.d.ts.map