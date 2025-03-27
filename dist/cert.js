import fs from 'fs';
import { spawnSync, execSync } from 'child_process';
/**
 * Create a record "127.0.0.1 hostname" to the /etc/hosts.
 * Will ask for admin password via sudo when appending.
 *
 * @param host The hostname we wish to add
 */
export function tryAddHostEntry(host) {
    const entry = `127.0.0.1 ${host}\n::1 ${host}\n`;
    const sudo = spawnSync('sudo', ['tee', '-a', '/etc/hosts'], {
        input: entry,
        stdio: ['pipe', 'inherit', 'inherit']
    });
    if (sudo.status === 0) {
        console.log(`[setupCertificate] Successfully added "${host}" to /etc/hosts.`);
        return true;
    }
    else {
        console.error(`\n[setupCertificate] *** ERROR: Could not modify /etc/hosts. ***\n` +
            `You may need to add the following manually:\n\n${entry}`);
        return false;
    }
}
/**
 * Given a hostname, attempt to add an entry to /etc/hosts which points to 127.0.0.1.
 *
 * @param host The hostname we wish to add.
 */
function updateHostsFile(host) {
    let hostsFile;
    try {
        hostsFile = fs.readFileSync('/etc/hosts', 'utf8');
    }
    catch (err) {
        console.warn(`[updateHostsFile] Warning: Could not read /etc/hosts.\n${err}`);
        return;
    }
    // TODO: Actually look at the records and add them
    if (!hostsFile.includes(host)) {
        console.info(`[updateHostsFile] Host "${host}" not found in /etc/hosts. Attempting to add...`);
        tryAddHostEntry(host);
    }
}
/**
 * Create a self-signed TLS certificate and install it locally.
 * This ensures we can locally serve HTTPS without certificate errors.
 * See `mkcert` for more info. We could do this manually via openssl, but mkcert handles a lot of
 * the nuances of cert installation for us.
 *
 * It will attempt to update the /etc/hosts file automatically.
 *
 * @param certPemPath Path of the cert .pem file
 * @param certKeyPath Path of the key .pem file
 * @param host Hostname for the TLS certificate
 */
export function setupCertificate(certPemPath, certKeyPath, host) {
    const certMissing = !fs.existsSync(certPemPath) || !fs.existsSync(certKeyPath);
    if (certMissing) {
        console.log(`[setupCertificate] Certificates not found. Generating via mkcert...`);
        execSync(`mkcert -install -cert-file "${certPemPath}" -key-file "${certKeyPath}" "${host}" localhost 127.0.0.1 ::1`, { stdio: 'inherit' });
        console.log(`[setupCertificate] Certificates created: ${certPemPath}, ${certKeyPath}`);
    }
    else {
        console.log(`[setupCertificate] Cert files already exist. Skipping mkcert step.`);
    }
    updateHostsFile(host);
}
