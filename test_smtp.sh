#!/bin/bash
# test-smtp.sh — Test SMTP authentication via OpenSSL

# === Configuration ===
SMTP_HOST="mail.gandi.net"
SMTP_PORT="587"
USERNAME="support@miketerry.org"
PASSWORD="ThdfGandi.2674"

# Encode credentials in Base64
B64_USER=$(echo -n "$USERNAME" | base64)
B64_PASS=$(echo -n "$PASSWORD" | base64)

# Display status
echo "Connecting to $SMTP_HOST:$SMTP_PORT ..."
echo "Username (base64): $B64_USER"
echo "Password (base64): $B64_PASS"

# Use OpenSSL to connect and authenticate
openssl s_client -starttls smtp -crlf -quiet -connect "$SMTP_HOST:$SMTP_PORT" << EOF
EHLO localhost
AUTH LOGIN
$B64_USER
$B64_PASS
QUIT
EOF
