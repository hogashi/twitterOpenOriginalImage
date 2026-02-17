#!/usr/bin/bash

set -eo pipefail

which -a jq

oldversion="$(jq -r .version dist/manifest.json)"
echo 'version in dist/manifest.json: '"$oldversion"

echo -n 'new version?: '
read newversion
if [ "$newversion" = '' ]; then
  echo 'quit'
  exit 1
fi

jq -r '.version|="'"$newversion"'"' dist/manifest.json > dist/manifest.json.new
mv -f dist/manifest.json.new dist/manifest.json
