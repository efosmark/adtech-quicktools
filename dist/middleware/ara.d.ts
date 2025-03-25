import { Request, Response, NextFunction } from 'express';
export type ARARegisterSourceHandler = (req: Request, res: Response) => AttributionSource | null;
export type ARARegisterTriggerHandler = (req: Request, res: Response) => AttributionSource | null;
export declare function onRegisterSource(handler: ARARegisterSourceHandler, opts: {
    logRequests: boolean;
} | null): (req: Request, res: Response, next: NextFunction) => void;
export declare function onRegisterTrigger(handler: ARARegisterTriggerHandler, opts: {
    logRequests: boolean;
} | null): (req: Request, res: Response, next: NextFunction) => void;
declare const _default: {
    onRegisterSource: typeof onRegisterSource;
    onRegisterTrigger: typeof onRegisterTrigger;
};
export default _default;
