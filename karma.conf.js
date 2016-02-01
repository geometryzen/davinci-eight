// Karma configuration
// Generated on Fri Jan 29 2016 10:38:22 GMT-0500 (EST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    // basePath: 'generated/',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jspm', 'jasmine'],

    plugins: ['karma-jspm', 'karma-jasmine', 'karma-chrome-launcher'],

    jspm: {
      config: 'config.js',
      packages: 'jspm_packages/',
      // These files are loaded dynamically via SystemJS before the tests run.
      loadFiles: [
        'system/**/*.spec.js'
      ],
      serveFiles: [
        'system/**/!(*spec).js'
      ]
    },


    // list of files / patterns to load in the browser
    // These files are loaded using <script> tags so it's a good place to put polyfill files.
    files: [
    ],

    // This allows us to avoid the Karma base virtual directory issue without dropping
    // the baseURL in the JSPM configuration.
    proxies: {
      '/system': '/base/system'
    },


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


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
    concurrency: Infinity
  })
}
