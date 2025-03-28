"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPolicy = void 0;
const HEADER_PERMISSIONS_POLICY = "Permissions-Policy";
const PATH_DOT_IG_PERMISSIONS = '/.well-known/interest-group/permissions';
const POLICY_RUN_AD_AUCTION = "run-ad-auction";
const POLICY_PRIVATE_AGGREGATION = "private-aggregation";
const POLICY_JOIN_AD_INTEREST_GROUP = "join-ad-interest-group";
const POLICY_FENCED_UNPARTITIONED_STORAGE_READ = "fenced-unpartitioned-storage-read";
const serializePermissionPolicy = (data) => Object.keys(data)
    .filter(k => data[k] !== undefined)
    .map(k => `${k}=(${data[k]})`)
    .join(', ');
;
const createPolicy = (policy) => {
    return (req, res, next) => {
        res.setHeader(HEADER_PERMISSIONS_POLICY, serializePermissionPolicy({
            [POLICY_RUN_AD_AUCTION]: policy.runAdAuction,
            [POLICY_PRIVATE_AGGREGATION]: policy.privateAggregation,
            //[POLICY_JOIN_AD_INTEREST_GROUP]: [policy.joinAdInterestGroup, req.headers.referer].join(' '),
            [POLICY_JOIN_AD_INTEREST_GROUP]: policy.joinAdInterestGroup,
            [POLICY_FENCED_UNPARTITIONED_STORAGE_READ]: policy.fencedUnpartitionedStorageRead,
        }));
        if (req.url.startsWith(PATH_DOT_IG_PERMISSIONS)) {
            res.setHeader('Cache-Control', 'no-store');
            res.json({
                joinAdInterestGroup: true,
                leaveAdInterestGroup: true
            });
        }
        else {
            next();
        }
    };
};
exports.createPolicy = createPolicy;
exports.default = {
    createPolicy: exports.createPolicy
};
