import https from 'https';
import fs from 'fs';
import path from 'path';
import express from 'express';
export default ({ port, hostname, app, buildApp, key, cert, httpsServer }) => {
    if (!app && !buildApp)
        throw new Error("Must have supplied an app or an app building function.");
    if (!httpsServer)
        httpsServer = https.createServer({
            key: fs.readFileSync(path.join(__dirname, key)),
            cert: fs.readFileSync(path.join(__dirname, cert))
        });
    if (!app && buildApp)
        app = buildApp(express(), { port, hostname, key, cert, httpsServer });
    if (!app)
        throw new Error("No app defined.");
    httpsServer.addListener("request", app);
    httpsServer.listen(port, hostname, () => {
        console.log(`App is running at https://${hostname}:${port}`);
    });
    return httpsServer;
};
