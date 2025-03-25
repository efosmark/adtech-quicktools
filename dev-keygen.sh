#!/bin/sh

set -e  # Exit immediately on error

# Default flag
UPDATE_HOSTS=true

# Parse flags
while [ "$#" -gt 0 ]; do
    case "$1" in
        --no-hosts)
            UPDATE_HOSTS=false
            shift
            ;;
        *)
            if [ -z "$NAME" ]; then
                NAME="$1"
            else
                echo "Invalid argument: $1"
                exit 1
            fi
            shift
            ;;
    esac
done

# Input validation
if [ -z "$HOST" ]; then
    echo "Usage: $0 [--no-hosts] <name> <host>"
    echo "Example: $0 mydevserver.local"
    echo "         $0 --no-hosts mydevserver.local"
    exit 1
fi

# Configurable variables
VALID_DAYS=7
CERT_DIR="./ssl"
CERT_KEY="$CERT_DIR/dev_${HOST}_key.pem"
CERT_PEM="$CERT_DIR/dev_${HOST}.pem"

# Ensure certificate directory exists
mkdir -p "$CERT_DIR"

# Check for mkcert and use it if available
if command -v mkcert >/dev/null 2>&1; then
    echo "Using mkcert to generate certificates..."
    mkcert -install -cert-file "$CERT_PEM" -key-file "$CERT_KEY" "$HOST" "localhost" "127.0.0.1" ::1

else
    echo "mkcert not found. Falling back to OpenSSL..."
    openssl req -nodes -new -x509 \
        -keyout "$CERT_KEY" \
        -out "$CERT_PEM" \
        -days "$VALID_DAYS" \
        -subj "/CN=$HOST" \
        -addext "subjectAltName=DNS:$HOST,IP:127.0.0.1"

    # Add certificate to trust store
    if [ -d "/etc/ca-certificates/trust-source/anchors/" ]; then
        # Linux
        sudo cp "$CERT_PEM" /etc/ca-certificates/trust-source/anchors/
        sudo trust extract-compat
        echo "Certificate added to the system trust store (Arch Linux)."

    elif [ -d "/Library/Keychains/System.keychain" ]; then
        # macOS
        sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "$CERT_PEM"
        echo "Certificate generated and added to trusted certs (macOS)."

    else
        echo "System trust directory not found."
        exit 1
    fi
fi

# Append to /etc/hosts if enabled
if [ "$UPDATE_HOSTS" = true ]; then
    if ! grep -qE "127\.0\.0\.1\s+$HOST" /etc/hosts; then
        echo "127.0.0.1 $HOST" | sudo tee -a /etc/hosts > /dev/null
        echo "Added '$HOST' to /etc/hosts mapping to 127.0.0.1."
    else
        echo "'$HOST' already exists in /etc/hosts."
    fi
else
    echo "Skipping update to /etc/hosts as requested."
fi

echo "Certificate Details:"
echo " - Key:  $CERT_KEY"
echo " - Cert: $CERT_PEM"
