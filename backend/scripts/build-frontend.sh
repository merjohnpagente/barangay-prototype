#!/bin/sh
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

cd "$ROOT/frontend"
npm install --no-audit --no-fund
npm run build

rm -rf "$ROOT/backend/public/assets"
mkdir -p "$ROOT/backend/public/assets" "$ROOT/backend/storage/app/spa"
cp -r dist/assets/. "$ROOT/backend/public/assets/"
cp dist/index.html "$ROOT/backend/storage/app/spa/index.html"

echo "Frontend built and copied into the Laravel app."
