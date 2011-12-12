#!/bin/sh
coffee -o . src/chroma.coffee
cat LICENSE > chroma.min.js
uglifyjs chroma.js >> chroma.min.js

