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
      "dist/davinci-eight.min.js": "dist/davinci-eight.js"
    }
  });

  // Load external tasks
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  // grunt.loadNpmTasks('grunt-jasmine-task');

  // Make task shortcuts
  grunt.registerTask('default', 'requirejs min');
  // grunt.registerTask('test', 'jasmine');

};
