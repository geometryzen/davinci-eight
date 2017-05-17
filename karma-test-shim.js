//
// __karma__ is a global (window) property.
//

// Turn on full stack traces in errors to help debugging.
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// (1)
var builtPaths = (__karma__.config.builtPaths || ['test/'])
    .map(function (p) { return '/base/' + p; });

// (2) Use this hook to tell Karma not to start the tests.
// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function () { };

// (3)
function isJsFile(path) {
    return path.slice(-3) == '.js';
}

// (4)
function isSpecFile(path) {
    return /\.spec\.(.*\.)?js$/.test(path);
}

// (5)
function isBuiltFile(path) {
    return isJsFile(path) &&
        builtPaths.reduce(function (keep, bp) {
            return keep || (path.substr(0, bp.length) === bp);
        }, false);
}

// (6) We only want .spec files that are part of our library.
var allSpecFiles = Object.keys(window.__karma__.files)
    .filter(isSpecFile)
    .filter(isBuiltFile);

// (7) Karma ads the path `base` to the webserver URL.
SystemJS.config({
    baseURL: '/base/'
});

// (8) Referes to the pattern in the karma.conf.js
System.import('systemjs.config.js')
    .then(initTesting);

// (9)
function initTesting() {
    return Promise.all(
        allSpecFiles.map(function (moduleName) {
            return System.import(moduleName);
        })
    )
        .then(function () {
            __karma__.start();
        }, function (error) {
            console.error(error.stack || error);
            __karma__.start();
        });
}