#!/usr/bin/env bash

set -euo pipefail

if ! command -v jq &> /dev/null; then
  echo "Error: jq is not installed"
  exit 1
fi

if [ ! -f dist/manifest.json ]; then
  echo "Error: dist/manifest.json not found"
  exit 1
fi

oldversion="$(jq -r .version dist/manifest.json)"
echo 'version in dist/manifest.json: '"$oldversion"

echo -n 'new version?: '
read -r newversion
if [ "$newversion" = '' ]; then
  echo 'quit'
  exit 1
fi

jq -r '.version|="'"$newversion"'"' dist/manifest.json > dist/manifest.json.new
mv -f dist/manifest.json.new dist/manifest.json
