#!/bin/sh
coffee -o . -j chroma.js src/color.coffee src/colorscale.coffee src/limits.coffee src/utils.coffee src/colors/*.coffee
uglifyjs chroma.js > chroma.min.js

