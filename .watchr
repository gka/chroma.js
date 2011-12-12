watch ( 'src/(.*)\.coffee' ) { |md| system("build.sh; node test/test.js") }
watch ( 'test/test.js' ) { |md| system("node test/test.js") }
