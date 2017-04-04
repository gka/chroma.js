"use strict";

var fs = require('fs'),
  pkgInfo = JSON.parse(fs.readFileSync(__dirname + '/package.json'));

module.exports = function(grunt) {

  grunt.initConfig({
    clean: {
      pre: [
        'chroma.js',
        'chroma.min.js',
        'license.coffee',
      ],
      post: ['chroma.coffee']
    },
    coffee: {
      compile: {
        options: {
          join: true
        },
        files: {
          'chroma.js': [
            'license.coffee',
            'chroma.coffee'
          ],
        },
      }
    },
    replace: {
      dist: {
        options: { patterns: [{ match: 'version', replacement: pkgInfo.version }] },
        files: [{expand: true, flatten: true, src: ['chroma.js'], dest: '.'}]
      }
    },
    uglify: {
      options: {
        banner: "/*\n" + fs.readFileSync("LICENSE", {encoding: "utf8"}) + "\n*/\n",
      },
      my_target: {
        files: {
          'chroma.min.js': ['chroma.js']
        },
      },
    },
    copy: {
      main: {
        files: [
          // copy build files into docs folder
          {expand: true, src: ['chroma*.js'], dest: 'docs/libs/', filter: 'isFile'},
        ],
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('license', function() {
    var license = [
      "###*",
      " * @license",
      " *",
    ].concat(fs.readFileSync('LICENSE', {encoding: "utf8"}).split("\n").map(function(line) {
      return " * " + line;
    }));
    license.push("###\n");
    fs.writeFileSync('license.coffee', license.join("\n"));
  });

  grunt.registerTask('catty', function() {
    require("catty")({ global: true })
      .coffee(true)
      .addLibrary("src")
      .cat("src/index.coffee", "./chroma.coffee");
  });

  grunt.registerTask('default', ['clean:pre', 'license', 'catty', 'coffee', 'replace',
    'uglify', 'copy', 'clean:post']);
};

