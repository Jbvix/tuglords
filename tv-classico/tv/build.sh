#!/bin/sh
# Build da versão TV: junta os módulos ES em um único script (esbuild) e
# transpila para ES5 (Babel) para TVs antigas (Samsung Orsay/Maple, LG webOS),
# com polyfills mínimos (tv/es5-prelude.js). Depois troca o ?v=.
# Ferramentas em ../tools/es5 (npm i). Uso: tv/build.sh [versao]
set -e
cd "$(dirname "$0")/.."
TOOLS=${TOOLS:-../tools/es5/node_modules/.bin}
$TOOLS/esbuild src/js/main.js --bundle --format=iife --target=es2017 --charset=utf8 --outfile=tv/build/game.modern.js --log-level=warning
$TOOLS/babel tv/build/game.modern.js --no-babelrc --config-file ../tools/es5/babel.config.json -o tv/build/game.es5.js
cat tv/es5-prelude.js tv/build/game.es5.js > tv/build/game.js
rm -f tv/build/game.modern.js tv/build/game.es5.js
sh tv/bump.sh "$1"
