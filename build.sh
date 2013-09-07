#!/bin/sh
coffee -o . -j chroma.js src/api.coffee src/color.coffee src/conversions/*.coffee  src/scale.coffee src/limits.coffee src/colors/*.coffee src/utils.coffee src/interpolate.coffee
uglifyjs chroma.js > chroma.min.js

