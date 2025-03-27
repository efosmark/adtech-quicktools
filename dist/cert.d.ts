/**
 * Create a record "127.0.0.1 hostname" to the /etc/hosts.
 * Will ask for admin password via sudo when appending.
 *
 * @param host The hostname we wish to add
 */
export declare function tryAddHostEntry(host: string): boolean;
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
export declare function setupCertificate(certPemPath: string, certKeyPath: string, host: string): void;
//# sourceMappingURL=cert.d.ts.map