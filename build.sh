#!/bin/sh
coffee -o . -j chroma.js src/*.coffee
cat LICENSE-nonsource > chroma.min.js
uglifyjs chroma.js >> chroma.min.js
