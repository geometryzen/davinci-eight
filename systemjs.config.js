(function (global) {
    System.config({
        paths: {
            'npm:': 'node_modules/'
        },
        map: {
            'test': 'test',
            'tslib': 'npm:tslib/tslib.js'
        },
        packages: {
            test: {
                defaultExtension: 'js'
            },
            tslib: {
                defaultExtension: 'js'
            }
        }
    });
})(this);
