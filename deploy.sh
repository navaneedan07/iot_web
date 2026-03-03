#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
#  ScoreMe – Azure VM deployment script
#  Run this ON the VM after cloning the repo
# ═══════════════════════════════════════════════════════════
set -euo pipefail

echo "──────────────────────────────────────"
echo " ScoreMe Azure VM Setup"
echo "──────────────────────────────────────"

# ── 1. Install Docker if not present ──
if ! command -v docker &> /dev/null; then
  echo "→ Installing Docker..."
  sudo apt-get update -qq
  sudo apt-get install -y ca-certificates curl gnupg
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update -qq
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  sudo usermod -aG docker "$USER"
  echo "✓ Docker installed. You may need to log out and back in for group changes."
fi

# ── 2. Create .env if missing ──
if [ ! -f .env ]; then
  echo "→ Creating .env from .env.example..."
  cp .env.example .env

  # Generate a strong random JWT secret
  JWT=$(openssl rand -base64 48)
  sed -i "s|CHANGE_ME_random_64_char_string|${JWT}|" .env

  # Generate a strong DB password
  DBPW=$(openssl rand -base64 24)
  sed -i "s|CHANGE_ME_strong_password_here|${DBPW}|" .env

  echo "✓ .env created with generated secrets"
  echo "  → Review .env and adjust values if needed before continuing."
  echo "  → Then re-run this script."
  exit 0
fi

# ── 3. Build & start ──
echo "→ Building containers..."
docker compose build --pull

echo "→ Starting services..."
docker compose up -d

echo ""
echo "──────────────────────────────────────"
echo " ✓ ScoreMe is running!"
echo "   Open http://$(curl -s ifconfig.me):80"
echo "──────────────────────────────────────"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f        # follow logs"
echo "  docker compose down           # stop all"
echo "  docker compose up -d --build  # rebuild & restart"
