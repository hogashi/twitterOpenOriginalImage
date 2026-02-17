#!/usr/bin/bash

set -eo pipefail

which -a jq

echo "$1"

if [ "$1" = "r" ]; then
  mv -f dist/manifest.json{.chrome,}
  exit
fi

mv -f dist/manifest.json{,.chrome}
jq '.update_URL|="https://edge.microsoft.com/extensionwebstorebase/v1/crx"' dist/manifest.json.chrome > dist/manifest.json
