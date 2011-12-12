#!/bin/sh
coffee -o . src/chroma.coffee
uglifyjs chroma.js > chroma.min.js

