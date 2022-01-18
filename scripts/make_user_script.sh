#!/bin/bash

set -e

SCRIPT_DIRNAME='scripts'
TMP_DIRNAME="${SCRIPT_DIRNAME}/tmp"
HEADER_FILENAME="${TMP_DIRNAME}/header.js"
MAIN_TS_FILENAME="${TMP_DIRNAME}/main_edited.ts"
MAIN_JS_FILENAME="${TMP_DIRNAME}/main_compiled.js"
TARGET_FILENAME="tooi-forGreaseTamperMonkey.user.js"

if [ ! -f "${SCRIPT_DIRNAME}/$(basename ${0})" ]; then
  echo "run this script at the top directory." 1>&2
  exit 1
fi

mkdir -p "${TMP_DIRNAME}"

VERSION="$(cat dist/manifest.json | jq -r .version)"

cat > "${HEADER_FILENAME}" <<__EOS__
// ==UserScript==
// @author          hogashi
// @name            twitterOpenOriginalImage
// @namespace       https://hogashi.hatenablog.com/
// @description     TwitterページでOriginalボタンを押すと原寸の画像が開きます(https://hogashi.hatenablog.com)
// @include         https://twitter.com*
// @include         https://mobile.twitter.com*
// @include         https://tweetdeck.twitter.com*
// @include         https://pbs.twimg.com/media*
// @version         ${VERSION}
// ==/UserScript==

__EOS__

cat src/main.ts | perl -pe 's/^export //g' > "${MAIN_TS_FILENAME}"

echo "tsc-ing..." 1>&2
node_modules/.bin/tsc --outFile "${MAIN_JS_FILENAME}" "${MAIN_TS_FILENAME}"
cat "${HEADER_FILENAME}" "${MAIN_JS_FILENAME}" > "${TARGET_FILENAME}"
echo "burned: ${TARGET_FILENAME}" 1>&2
