#!/usr/bin/env bash
# Gera o service worker e o .zip para enviar ao Netlify Drop.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/gerar_sw.py
rm -f estudos-tce-rj.zip
(cd app && zip -qr ../estudos-tce-rj.zip . -x '.*')
echo "Pacote: $(pwd)/estudos-tce-rj.zip ($(du -h estudos-tce-rj.zip | cut -f1))"
