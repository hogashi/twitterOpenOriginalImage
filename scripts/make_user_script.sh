#!/bin/bash

cd $(dirname $0)

node ./make_user_script.js \
  | cat - ../dist/js/tooiForMonkeys.bundle.js \
  > ../tooi-forGreaseTamperMonkey.user.js

cd -
