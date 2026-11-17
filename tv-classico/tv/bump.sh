#!/bin/sh
# Troca o ?v= de todos os assets no index.html (fura o cache da TV).
V=${1:-$(date +%Y%m%d%H%M)}
cd "$(dirname "$0")/.." && sed -i -E "s/\?v=[A-Za-z0-9_]+/?v=$V/g" index.html && echo "v=$V"
