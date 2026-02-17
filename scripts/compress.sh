#!/usr/bin/env bash

set -euo pipefail

if ! command -v jq &> /dev/null; then
  echo "Error: jq is not installed"
  exit 1
fi

if ! command -v zip &> /dev/null; then
  echo "Error: zip is not installed"
  exit 1
fi

if [ ! -f dist/manifest.json ]; then
  echo "Error: dist/manifest.json not found"
  exit 1
fi

if [ ! -d dist ]; then
  echo "Error: dist directory not found"
  exit 1
fi

suffix=""
if [ -n "${1:-}" ]; then
  suffix="-$1"
fi

version="$(jq -r .version dist/manifest.json)"
filename="$(echo -n "$version" | tr '.' '-')$suffix"
zip -r "$filename.zip" dist
