import serve from './serve';
declare const _default: {
    ara: {
        onRegisterSource: typeof import("./middleware/ara").onRegisterSource;
        onRegisterTrigger: typeof import("./middleware/ara").onRegisterTrigger;
    };
    byos: {
        biddingSignalsHandler: typeof import("./middleware/byos").biddingSignalsHandler;
        scoringSignalsHandler: typeof import("./middleware/byos").scoringSignalsHandler;
    };
    cors: {
        enableCORS: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    };
    enablements: {
        allowAdAuction: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
        allowFencedFrame: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    };
    favicon: (faviconLetters: string) => (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    permissions: {
        createPolicy: (policy: import("./middleware/permissions").PermissionsPolicy) => (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    };
    socketLogger: (httpsServer?: import("https").Server) => (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
    serve: typeof serve;
};
export default _default;
//# sourceMappingURL=index.d.ts.map