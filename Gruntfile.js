"use strict";

var fs = require('fs');

module.exports = function(grunt) {

  grunt.initConfig({
    clean: [
      'chroma.js',
      'chroma.min.js',
      'license.coffee',
    ],
    coffee: {
      compile: {
        options: {
          join: true
        },
        files: {
          'chroma.js': [
            'license.coffee',
            'src/api.coffee',
            'src/color.coffee',
            'src/conversions/*.coffee',
            'src/scale.coffee',
            'src/limits.coffee',
            'src/colors/*.coffee',
            'src/utils.coffee',
            'src/interpolate.coffee',
            'src/blend.coffee',
          ],
        },
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
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');

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

  grunt.registerTask('default', ['clean', 'license', 'coffee', 'uglify']);
};

