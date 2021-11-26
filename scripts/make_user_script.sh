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

node "${SCRIPT_DIRNAME}/make_user_script.js" > "${HEADER_FILENAME}"
cat src/main.ts | perl -pe 's/^export //g' > "${MAIN_TS_FILENAME}"

echo "build-ing..." 1>&2
node_modules/.bin/esbuild --outfile="${MAIN_JS_FILENAME}" --bundle --legal-comments=inline "${MAIN_TS_FILENAME}"
SPLITTER_LINE_NUMBER="$(grep -n '//! %%% splitter for userjs %%%' -- ${MAIN_JS_FILENAME} | perl -pe 's/^([0-9]+).*$/$1/')"
test "$SPLITTER_LINE_NUMBER" -ge 0
cat "${HEADER_FILENAME}" > "${TARGET_FILENAME}"
tail -n+"${SPLITTER_LINE_NUMBER}" "${MAIN_JS_FILENAME}" >> "${TARGET_FILENAME}"
echo "burned: ${TARGET_FILENAME}" 1>&2
