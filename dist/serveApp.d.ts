import https from 'https';
import express from 'express';
type AppBuildCallback = (app: express.Express, cfg: Partial<AppConfig>) => express.Express;
export interface AppConfig {
    port: number;
    hostname: string;
    key: string;
    cert: string;
    app?: express.Express;
    buildApp?: AppBuildCallback;
    httpsServer?: https.Server;
}
declare const _default: ({ port, hostname, app, buildApp, key, cert, httpsServer }: AppConfig) => https.Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
export default _default;
