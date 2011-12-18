#!/bin/sh
coffee -o . -j chroma.js src/chroma.coffee src/utils.coffee
cat LICENSE-nonsource > chroma.min.js
uglifyjs chroma.js >> chroma.min.js

coffee -o . -j chroma.colors.src.js src/colors/*.coffee
cat LICENSE-colors > chroma.colors.js
# uglifyjs chroma.colors.src.js >> chroma.colors.js
cp chroma.colors.src.js chroma.colors.js
rm chroma.colors.src.js
