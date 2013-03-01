#!/bin/sh
coffee -o . -j chroma.core.js src/chroma.coffee src/colorscale.coffee src/utils.coffee
coffee -o . -j chroma.colors.js src/colors/*.coffee
coffee -o . -j chroma.js src/chroma.coffee src/colorscale.coffee src/utils.coffee src/colors/*.coffee

# cat LICENSE-colors >> chroma.min.js
uglifyjs chroma.js > chroma.min.js
mv chroma*.js dist/
