#!/usr/bin/env bash

set -euo pipefail

if ! command -v jq &> /dev/null; then
  echo "Error: jq is not installed"
  exit 1
fi


if [ "${1:-}" = "r" ]; then
  mv -f dist/manifest.json{.chrome,}
  exit
fi

mv -f dist/manifest.json{,.chrome}
jq '.update_URL|="https://edge.microsoft.com/extensionwebstorebase/v1/crx"' dist/manifest.json.chrome > dist/manifest.json
