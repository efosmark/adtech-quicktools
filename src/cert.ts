import fs from 'fs';
import { execSync } from 'child_process';


import { spawnSync } from 'child_process';

function tryAddHostEntry(host) {
    const entry = `127.0.0.1 ${host}\n::1 ${host}\n`;
    const sudo = spawnSync('sudo', ['tee', '-a', '/etc/hosts'], {
        input: entry,
        stdio: ['pipe', 'inherit', 'inherit']
    });

    if (sudo.status === 0) {
        console.log(`[setupCertificate] Successfully added "${host}" to /etc/hosts.`);
        return true;
    } else {
        console.error(
            `\n[setupCertificate] *** ERROR: Could not modify /etc/hosts. ***\n` +
            `You may need to add the following manually:\n\n${entry}`
        );
        return false;
    }
}

/**
 * Given a hostname, attempt to add an entry to /etc/hosts which points to 127.0.0.1.
 * 
 * @param host The hostname we wish to add.
 */
function updateHostsFile(host: string) {
    let hostsFile: string;
    try {
        hostsFile = fs.readFileSync('/etc/hosts', 'utf8');
    } catch (err) {
        console.warn(`[updateHostsFile] Warning: Could not read /etc/hosts.\n${err}`);
        return;
    }

    // TODO: Actually look at the records and add them
    if (!hostsFile.includes(host)) {
        console.info(`[updateHostsFile] Host "${host}" not found in /etc/hosts. Attempting to add...`);
        tryAddHostEntry(host);
    }
}

export function setupCertificate(certPemPath: string, certKeyPath: string, host: string) {
    const certMissing = !fs.existsSync(certPemPath) || !fs.existsSync(certKeyPath);
    if (certMissing) {
        console.log(`[setupCertificate] Certificates not found. Generating via mkcert...`);
        execSync(
            `mkcert -install -cert-file "${certPemPath}" -key-file "${certKeyPath}" "${host}" localhost 127.0.0.1 ::1`,
            { stdio: 'inherit' }
        );
        console.log(`[setupCertificate] Certificates created: ${certPemPath}, ${certKeyPath}`);
    } else {
        console.log(`[setupCertificate] Cert files already exist. Skipping mkcert step.`);
    }

    updateHostsFile(host);
}

module.exports = { setupCertificate };
