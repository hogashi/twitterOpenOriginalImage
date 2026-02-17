#!/usr/bin/bash

if [ -n "$1" ]; then
  suffix="-$1"
fi

version="$(jq -r .version dist/manifest.json)"
filename="$(echo -n $version | tr '.' '-')$suffix"
zip -r "$filename.zip" dist
