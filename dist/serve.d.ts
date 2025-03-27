import https from 'https';
import http from 'http';
import express, { Handler } from 'express';
export interface ServeAppConfig {
    defaultLogger: Handler | null;
    certRootPath: string;
    staticRootPath: string;
}
export declare const conf: ServeAppConfig;
export declare const newServer: (hostname: string, useHttps: boolean) => http.Server | https.Server;
export interface BuildAppConfig {
    port: number;
    hostname: string;
    https: boolean;
    server: http.Server | https.Server;
}
type BuildAppCallback = (app: express.Express, cfg: BuildAppConfig) => express.Express;
export interface AppConfig {
    port: number;
    hostname: string;
    https?: boolean;
    logger?: Handler;
    staticPath?: string | false;
    buildApp: BuildAppCallback;
}
declare function serveApp({ port, hostname, buildApp, https: useHttps, logger, staticPath }: AppConfig): Promise<https.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>>;
declare namespace serveApp {
    var configure: (overrides: Partial<ServeAppConfig>) => void;
}
export default serveApp;
//# sourceMappingURL=serve.d.ts.map