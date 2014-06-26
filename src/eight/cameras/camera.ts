import object3D = require('eight/core/object3D');

var camera = function() {

    var that = object3D();

    // FIXME
    //  that.projectionMatrix = mat4.create();

    // Add privileged methods to that.

    return that;
};

export = camera;
