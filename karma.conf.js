// Karma configuration
// Generated on Fri Jan 29 2016 10:38:22 GMT-0500 (EST)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        // systemjs must be the first framework in the list.
        frameworks: ['systemjs', 'jasmine'],

        systemjs: {
            // Path to the SystemJS configuration file 
            configFile: 'config.js',
            // SystemJS configuration specifically for tests, added after your config file. 
            // Good for adding test libraries and mock modules 
            config: {
                paths: {
                    "typescript": "node_modules/typescript/lib/typescript.js",
                    "systemjs": "node_modules/systemjs/dist/system.js",
                    'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
                    'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js'
                },
                packages: {
                    'test/unit': {
                        defaultExtension: 'ts'
                    },
                    'src': {
                        defaultExtension: 'ts'
                    }
                },
                transpiler: 'typescript'
            },
            // Patterns for files that you want Karma to make available, but not loaded until a module requests them. eg. Third-party libraries
            serveFiles: [
                'src/**/*.ts'
            ]
        },

        // Karma auto loads plugins unless you specify a plugins config.
        plugins: [
            'karma-jspm',
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-systemjs'
        ],

        // list of files / patterns to load in the browser
        // These files are loaded using <script> tags so it's a good place to put polyfill files.
        files: [
            'src/davinci-eight/**/*.spec.ts'
        ],

        // This allows us to avoid the Karma base virtual directory issue without dropping
        // the baseURL in the JSPM configuration.
        proxies: {
            // '/base/jspm_packages/': '/jspm_packages/'
            //    '/test/system': '/base/test/system'
        },


        // list of files to exclude
        exclude: [],


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
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        // concurrency: Infinity
    })
}
