#!/usr/bin/env bash
# ==============================================================================
# Nightmare Before Christmas - 1-Click VPS Provisioning Script
# ==============================================================================
set -e

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "Usage: sudo bash setup.sh <YOUR_DOMAIN_OR_SUBDOMAIN>"
    echo "Example: sudo bash setup.sh game.example.com"
    exit 1
fi

echo "=== 1. Updating packages & Installing Nginx, Python3-venv, Certbot ==="
apt update && apt install -y nginx python3 python3-pip python3-venv certbot python3-certbot-nginx git curl

echo "=== 2. Creating web directory /var/www/nightmare ==="
mkdir -p /var/www/nightmare
chown -R www-data:www-data /var/www/nightmare
chmod -R 755 /var/www/nightmare

echo "=== 3. Setting up Nginx configuration ==="
sed "s/YOUR_DOMAIN.COM/$DOMAIN/g" vps/nginx.conf > /etc/nginx/sites-available/nightmare
ln -sf /etc/nginx/sites-available/nightmare /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

echo "=== 4. Obtaining Let's Encrypt Free SSL Certificate ==="
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@"$DOMAIN" || {
    echo "Certbot failed. Make sure your DNS A-record points to this VPS IP address!"
}

nginx -t && systemctl reload nginx

echo "=== 5. Installing Systemd Service for Telegram Bot ==="
cp vps/nightmare-bot.service /etc/systemd/system/nightmare-bot.service
systemctl daemon-reload
systemctl enable nightmare-bot

echo "======================================================================"
echo " Setup complete! Next steps:"
echo " 1. Clone repository to /var/www/nightmare"
echo " 2. Add TELEGRAM_BOT_TOKEN and WEBAPP_URL=https://$DOMAIN/player/ to /var/www/nightmare/.env"
echo " 3. Start bot: sudo systemctl start nightmare-bot"
echo "======================================================================"

