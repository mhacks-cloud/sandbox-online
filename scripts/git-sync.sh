#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT"

MESSAGE="${*:-Sandbox Online update $(date '+%Y-%m-%d %H:%M')}"

echo ""
echo "=============================================="
echo " GITHUB SYNC"
echo "=============================================="
echo ""

echo "📂 Projeto:"
echo "$ROOT"
echo ""

git add -A

if git diff --cached --quiet; then

  echo "ℹ️ Nenhuma alteração nova para commit."

else

  echo "📝 Criando commit:"
  echo "$MESSAGE"
  echo ""

  git commit -m "$MESSAGE"

fi

echo ""
echo "☁️ Enviando para GitHub..."

git push -u origin main

echo ""
echo "✅ GitHub sincronizado."
echo ""

git status --short
