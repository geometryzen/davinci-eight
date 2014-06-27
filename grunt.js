module.exports = function(grunt) {

  // Configure Grunt
  grunt.initConfig({

    requirejs: {
      compile: {
        options: {
          mainConfigFile: "build.js",
          paths: {
              'gl-matrix': './../vendor/gl-matrix/dist/gl-matrix'
          }
        }
      }
    },
    // minify the optimized library file
    min: {
      "dist/davinc-eight.min.js": "dist/davinci-eight.js"
    },
    // kick off jasmine, showing results at the cli
    jasmine: {
      all: ['test/runner.html']
    },
    // run jasmine tests any time watched files change
    watch: {
      files: ['src/**/*','test/spec/**/*'],
      tasks: ['jasmine']
    }
  });

  // Load external tasks
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-jasmine-task');

  // Make task shortcuts
  grunt.registerTask('default', 'jasmine requirejs min');
  grunt.registerTask('test', 'jasmine');

};
