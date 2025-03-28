import { Request, Response, NextFunction } from 'express';
export interface PermissionsPolicy {
    runAdAuction?: string;
    privateAggregation?: string;
    joinAdInterestGroup?: string;
    fencedUnpartitionedStorageRead?: string;
}
export declare const createPolicy: (policy: PermissionsPolicy) => (req: Request, res: Response, next: NextFunction) => void;
declare const _default: {
    createPolicy: (policy: PermissionsPolicy) => (req: Request, res: Response, next: NextFunction) => void;
};
export default _default;
//# sourceMappingURL=permissions.d.ts.map