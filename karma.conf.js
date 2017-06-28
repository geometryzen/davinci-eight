// Karma configuration

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // Karma auto loads plugins unless you specify a plugins config.
    plugins: [
      require('karma-coverage'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-jasmine-html-reporter')
    ],

    // list of files / patterns to load in the browser
    // These files are loaded using <script> tags so it's a good place to put polyfill files.
    files: [
      // Polyfills.
      'node_modules/core-js/client/shim.min.js',

      // Include this with a <script> tag so that System is defined.
      'node_modules/systemjs/dist/system.src.js',
      { pattern: 'node_modules/systemjs/dist/system.js.map', included: false, watched: false },

      //
      { pattern: 'systemjs.config.js', included: false, watched: false },

      'karma-test-shim.js',

      { pattern: 'test/**/*.js', included: false, watched: false },

      // Karma will load this under /base/node_modules/tslib/tslib.js
      { pattern: 'node_modules/tslib/tslib.js', included: false, watched: false },
    ],

    // This allows us to avoid the Karma base virtual directory issue without dropping
    // the baseURL in the JSPM configuration.
    proxies: {
    },


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/!(*spec).js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'kjhtml'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    // concurrency: Infinity
  })
}