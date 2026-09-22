#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT"

mkdir -p backups

STAMP="$(date +%Y%m%d-%H%M%S)"

FILE="backups/manual-$STAMP.tar.gz"

echo ""
echo "=============================================="
echo " BACKUP SANDBOX ONLINE"
echo "=============================================="
echo ""

echo "📦 Criando backup..."

tar \
  --exclude='./node_modules' \
  --exclude='./dist' \
  --exclude='./backups' \
  --exclude='./.git' \
  -czf "$FILE" \
  .

echo ""
echo "✅ Backup criado:"
echo "$FILE"
echo ""
