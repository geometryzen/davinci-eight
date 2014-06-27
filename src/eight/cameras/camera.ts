import object3D = require('eight/core/object3D');

interface Matrix4 {
    create();
}

declare var mat4: Matrix4;

var camera = function() {

    var base = object3D();
    
    var that = {
        // Delegate to the base camera.
        get position() { return base.position; },
        set position(value) { base.position = value },
        get attitude() { return base.attitude; },
        set attitude(value) { base.attitude = value },
        projectionMatrix: mat4.create()
    };

    return that;
};

export = camera;
