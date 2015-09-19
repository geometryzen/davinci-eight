// test/config/require/config.js
(function(require) {
    'use strict';

    require.onError = function(error) {
        var message = error.requireType + ': ';

        if (error.requireType === 'scripterror' || error.requireType === 'notloaded' && error.requireModules) {
            message += 'Illegal path or script error: ' + '[\'' + error.requireModules.join("', '") + '\']';
        }
        else {
            message += error.message;
        }

        throw new Error(message);
    };

    require.config({
        baseUrl: "amd",
        paths: {
          "gl-matrix": "../../vendor/gl-matrix/dist/gl-matrix-min",
          "davinci-blade": "../vendor/davinci-blade/amd/davinci-blade"
        }
    });
}(require));