all:
	node $$(which markdown) -f gfm -s src/index.css src/index.md --title "chroma.js api docs!" > index.html
	bin/post-process

preview:
	http-server
	# python -m SimpleHTTPServer
