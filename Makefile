all:
	node $$(which markdown) -s src/index.css -c gka/chroma-js src/index.md --title "chroma.js api docs!" > index.html
	git show master:chroma.min.js > vendor/chroma-js/chroma.min.js
	bin/post-process

preview:
	python -m SimpleHTTPServer
