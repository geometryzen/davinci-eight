import object3D = require('eight/core/object3D');
import glMatrix = require('gl-matrix');

var camera = function() {

    var base = object3D();
    
    var that = {
        // Delegate to the base camera.
        get position() { return base.position; },
        set position(value) { base.position = value },
        get attitude() { return base.attitude; },
        set attitude(value) { base.attitude = value },
        projectionMatrix: glMatrix.mat4.create()
    };

    return that;
};

export = camera;
