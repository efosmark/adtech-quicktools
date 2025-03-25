import { Request, Response, NextFunction } from 'express';
import https from 'https';
declare const _default: (httpsServer?: https.Server) => (req: Request, res: Response, next: NextFunction) => void;
export default _default;
