(function (global) {
    System.config({
        paths: {
            'npm:': 'node_modules/'
        },
        map: {
            'test': 'karma_test_build',
            'tslib': 'npm:tslib/tslib.js'
        },
        packages: {
            'test': {
                defaultExtension: 'js'
            },
            'tslib': {
                defaultExtension: 'js'
            }
        }
    });
})(this);
