"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPolicy = void 0;
var HEADER_PERMISSIONS_POLICY = "Permissions-Policy";
var PATH_DOT_IG_PERMISSIONS = '/.well-known/interest-group/permissions';
var POLICY_RUN_AD_AUCTION = "run-ad-auction";
var POLICY_PRIVATE_AGGREGATION = "private-aggregation";
var POLICY_JOIN_AD_INTEREST_GROUP = "join-ad-interest-group";
var POLICY_FENCED_UNPARTITIONED_STORAGE_READ = "fenced-unpartitioned-storage-read";
var serializePermissionPolicy = function (data) { return Object.keys(data)
    .filter(function (k) { return data[k] !== undefined; })
    .map(function (k) { return "".concat(k, "=(").concat(data[k], ")"); })
    .join(', '); };
var createPolicy = function (policy) {
    return function (req, res, next) {
        var _a;
        res.setHeader(HEADER_PERMISSIONS_POLICY, serializePermissionPolicy((_a = {},
            _a[POLICY_RUN_AD_AUCTION] = policy.runAdAuction,
            _a[POLICY_PRIVATE_AGGREGATION] = policy.privateAggregation,
            //[POLICY_JOIN_AD_INTEREST_GROUP]: [policy.joinAdInterestGroup, req.headers.referer].join(' '),
            _a[POLICY_JOIN_AD_INTEREST_GROUP] = policy.joinAdInterestGroup,
            _a[POLICY_FENCED_UNPARTITIONED_STORAGE_READ] = policy.fencedUnpartitionedStorageRead,
            _a)));
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
