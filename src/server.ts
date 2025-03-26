import morgan from 'morgan';
import serveStatic from 'serve-static';
import path from 'path';
import { Request, Response, NextFunction } from 'express';


import { createPolicy } from './middleware/permissions';
import { allowAdAuction, allowFencedFrame } from './middleware/enablements';
import serveApp from './serveApp';
import favicon from './middleware/favicon';
import { biddingSignalsHandler, scoringSignalsHandler } from './middleware/byos';
import socketLogger from './middleware/socketLogger';
import { enableCORS } from './middleware/cors';

morgan.token('host', (req: Request) => req.get('host') || 'unknown-host');
const logger = morgan(':status :method :host :url');

const fullyOpenPolicy = createPolicy({
    runAdAuction: "*",
    joinAdInterestGroup: "*",
    privateAggregation: "*",
    //fencedUnpartitionedStorageRead: "*"
});

const handleBiddingSignals = biddingSignalsHandler((signals, req) => {
    console.log("RECV: bidding signals request for DSP");
    console.dir(signals);
    return {
        keys: signals.keys.reduce((result: object, k: string) => {
            result[k] = k.split('=', 1);
            return result;
        }, {}),
    };
});

const handleScoringSignals = scoringSignalsHandler((signals, req) => {
    return {};
});

serveApp({
    port: 8001,
    hostname: 'ara-testing-1.local',
    buildApp: (app, cfg) => {
        app.use(favicon('IB'));
        app.use(logger);
        app.use(enableCORS);
        app.use(allowAdAuction);
        app.use(allowFencedFrame);
        app.use(fullyOpenPolicy);
        //app.use(socketLogger(cfg.httpsServer));
        app.get("/kv/bidding-signals", handleBiddingSignals);
        app.get("/kv/scoring-signals", handleScoringSignals);
        app.use(serveStatic(path.join(__dirname, `../static/bat.bing.local/`)));
        return app;
    },
}).then(() => {
    console.log('server started.');
});