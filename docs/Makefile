all:
	cat src/index.md ../CHANGELOG.md > tmp.md
	node $$(which markdown) -f gfm -s src/index.css tmp.md --title "chroma.js api docs!" > index.html
	bin/post-process
	rm tmp.md

preview:
	http-server
	# python -m SimpleHTTPServer
