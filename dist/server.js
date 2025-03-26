import morgan from 'morgan';
import serveStatic from 'serve-static';
import path from 'path';
import { createPolicy } from './middleware/permissions';
import { allowAdAuction, allowFencedFrame } from './middleware/enablements';
import serveApp from './serveApp';
import favicon from './middleware/favicon';
import { biddingSignalsHandler, scoringSignalsHandler } from './middleware/byos';
import socketLogger from './middleware/socketLogger';
import { enableCORS } from './middleware/cors';
morgan.token('host', (req) => req.get('host') || 'unknown-host');
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
        keys: signals.keys.reduce((result, k) => {
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
    hostname: 'bat.bing.local',
    key: '../../ssl/dev_bat.bing.local_key.pem',
    cert: '../../ssl/dev_bat.bing.local.pem',
    buildApp: (app, cfg) => {
        app.use(favicon('IB'));
        app.use(logger);
        app.use(enableCORS);
        app.use(allowAdAuction);
        app.use(allowFencedFrame);
        app.use(fullyOpenPolicy);
        app.use(socketLogger(cfg.httpsServer));
        app.get("/kv/bidding-signals", handleBiddingSignals);
        app.get("/kv/scoring-signals", handleScoringSignals);
        app.use(serveStatic(path.join(__dirname, `../static/bat.bing.local/`)));
        return app;
    },
});
serveApp({
    port: 8002,
    hostname: 'fake-dsp.local',
    key: '../../ssl/dev_fake-dsp.local_key.pem',
    cert: '../../ssl/dev_fake-dsp.local.pem',
    buildApp: (app) => {
        app.use(favicon('DSP'));
        app.use(logger);
        app.use(enableCORS);
        app.use(allowAdAuction);
        app.use(allowFencedFrame);
        app.use(fullyOpenPolicy);
        app.use(serveStatic(path.join(__dirname, `../static/fake-dsp.local/`)));
        return app;
    },
});
serveApp({
    port: 8003,
    hostname: 'advertiser.local',
    key: '../../ssl/dev_advertiser.local_key.pem',
    cert: '../../ssl/dev_advertiser.local.pem',
    buildApp: (app) => {
        app.use(favicon('ADV'));
        app.use(logger);
        app.use(enableCORS);
        app.use(allowAdAuction);
        app.use(allowFencedFrame);
        app.use(fullyOpenPolicy);
        app.use(serveStatic(path.join(__dirname, `../static/advertiser.local/`)));
        return app;
    },
});
serveApp({
    port: 8004,
    hostname: 'publisher-site.local',
    key: '../../ssl/dev_publisher-site.local_key.pem',
    cert: '../../ssl/dev_publisher-site.local.pem',
    buildApp: (app) => {
        app.use(favicon('PUB'));
        app.use(logger);
        app.use(enableCORS);
        app.use(allowAdAuction);
        app.use(allowFencedFrame);
        app.use(fullyOpenPolicy);
        app.use(serveStatic(path.join(__dirname, `../static/publisher-site.local/`)));
        return app;
    },
});
