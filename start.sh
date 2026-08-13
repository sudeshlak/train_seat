#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "Starting backend..."
docker compose up -d --build be

echo "Waiting for backend on :8080..."
for i in $(seq 1 60); do
  if curl -sf "http://localhost:8080/trains" >/dev/null; then
    echo "Backend is up."
    break
  fi
  if [ "$i" -eq 60 ]; then
    echo "Backend did not become ready in time." >&2
    exit 1
  fi
  sleep 2
done

echo "Building frontend (SSG against host :8080)..."
docker compose build fe

echo "Starting frontend..."
docker compose up -d fe

echo "App: http://localhost:3000"
echo "API: http://localhost:8080"
