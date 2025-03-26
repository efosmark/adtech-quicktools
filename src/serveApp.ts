import https from 'https';
import fs from 'fs';
import path from 'path';
import express from 'express';
import { setupCertificate } from './cert';

type AppBuildCallback = (app: express.Express, cfg: Partial<AppConfig>) => express.Express;

export interface AppConfig {
    port: number;
    hostname: string;
    key?: string;
    cert?: string;
    app?: express.Express;
    buildApp?: AppBuildCallback;
    httpsServer?: https.Server;
}

const CERT_PATH = path.join(__dirname, '..', 'ssl');

export default async ({ port, hostname, app, buildApp, httpsServer }: AppConfig) => {
    if (!app && !buildApp)
        throw new Error("Must have supplied an app or an app building function.");

    if (!httpsServer) {
        const certPath = path.join(CERT_PATH, `${hostname}.pem`);
        const keyPath = path.join(CERT_PATH, `${hostname}-key.pem`);

        setupCertificate(
            certPath,
            keyPath,
            hostname
        );

        httpsServer = https.createServer({
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
        });
    }

    if (!app && buildApp)
        app = buildApp(express(), { port, hostname, httpsServer });

    if (!app)
        throw new Error("No app defined.");

    httpsServer.addListener("request", app);
    httpsServer.listen(port, hostname, () => {
        console.log(`App is running at https://${hostname}:${port}`);
    });
    return httpsServer;
}