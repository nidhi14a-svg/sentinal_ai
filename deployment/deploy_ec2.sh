#!/bin/bash
# AWS EC2 Deployment Script for Sentinel AI Stack
# Sets up dependencies, clones/copies code, and boots the docker-compose stack.

set -e

echo "=== Sentinel AI EC2 Deployment ==="

# 1. Update and install basic dependencies
echo "[+] Updating package index..."
sudo apt-get update -y

echo "[+] Installing git, curl, and prerequisites..."
sudo apt-get install -y git curl apt-transport-https ca-certificates gnupg lsb-release

# 2. Install Docker if not already present
if ! [ -x "$(command -v docker)" ]; then
    echo "[+] Installing Docker Engine..."
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
fi

# 3. Enable and start Docker service
echo "[+] Starting Docker service..."
sudo systemctl enable docker
sudo systemctl start docker

# Add current user to docker group if needed
if ! groups $USER | grep &>/dev/null '\bdocker\b'; then
    echo "[+] Adding current user to the docker group..."
    sudo usermod -aG docker $USER
    echo "Please re-login or run 'newgrp docker' to execute docker without sudo."
fi

# 4. Boot the Integrated Stack
echo "[+] Creating .env file from template..."
if [ ! -f .env ]; then
    cp .env.example .env || echo "WARNING: .env.example not found, please configure your environment manually."
fi

echo "[+] Launching Sentinel AI stack via docker compose..."
sudo docker compose up --build -d

echo "[+] Stack is up and running!"
sudo docker compose ps
