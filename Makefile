all:
	markdown -s src/index.css -c gka/chroma-js src/index.md --title "chroma.js" > index.html
	bin/post-process

preview:
	python -m SimpleHTTPServer