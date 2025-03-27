import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import express, { Handler } from 'express';
import { setupCertificate } from './cert';
import serveStatic from 'serve-static';
import morgan from 'morgan';
import { Request } from 'express';

morgan.token('host', (req: Request) => req.get('host') || 'unknown-host');

export interface ServeAppConfig {
    defaultLogger: Handler | null;
    certRootPath: string;
    staticRootPath: string;
}

export const conf: ServeAppConfig = {
    defaultLogger: morgan(':status :method :host :url'),
    certRootPath: path.join(__dirname, 'ssl'),
    staticRootPath: path.join(path.dirname(require.main.filename), 'static')
};

export const newServer = (hostname: string, useHttps: boolean): http.Server | https.Server => {
    if (useHttps !== false) {
        if (!fs.existsSync(conf.certRootPath))
            fs.mkdirSync(conf.certRootPath, { recursive: true });
        const certPath = path.join(conf.certRootPath, `${hostname}.pem`);
        const keyPath = path.join(conf.certRootPath, `${hostname}-key.pem`);
        setupCertificate(
            certPath,
            keyPath,
            hostname
        );
        return https.createServer({
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
        });
    }
    return http.createServer();
}

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

export default async function serveApp({ port, hostname, buildApp, https: useHttps, logger, staticPath }: AppConfig) {
    const server = newServer(hostname, useHttps);
    const app = buildApp(express(), { port, hostname, https: useHttps !== false, server });

    if (staticPath !== false) {
        const p = staticPath ?? path.join(conf.staticRootPath, hostname);
        console.debug(`[serveApp] Looking for static path: ${p}`);
        if (fs.existsSync(p)) {
            console.debug(`[serveApp] Static path found. Automatically serving static resources.`);
            app.use(serveStatic(p));
        }
    }

    if (!logger && conf.defaultLogger)
        app.use(conf.defaultLogger);
    else if (logger)
        app.use(logger);

    server.addListener("request", app);
    server.listen(port, hostname, () => {
        console.log(`App is running at http${useHttps !== false ? 's' : ''}://${hostname}:${port}`);
    });
    return server;
}

serveApp.configure = (overrides: Partial<ServeAppConfig>) => {
    Object.assign(conf, overrides);
};