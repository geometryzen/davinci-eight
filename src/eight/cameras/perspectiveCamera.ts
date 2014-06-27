//
// perspectiveCamera.ts
//
// This functional constructor pattern illustrates the TypeScript way to extend a type using containment.
// It's not clear how we could do direct aggregation and remain type-safe when not using constructor functions.
//
import camera = require('eight/cameras/camera');

interface Matrix4 {
    perspective(matrix: Matrix4, fov: number, aspect: number, near: number, far: number);
}

declare var mat4: Matrix4;

var perspectiveCamera = function(fov: number = 50, aspect: number = 1, near: number = 0.1, far: number = 2000) {

    var base = camera();

    var that = {
        // Delegate to the base camera.
        get position() { return base.position; },
        set position(value) { base.position = value },
        get attitude() { return base.attitude; },
        set attitude(value) { base.attitude = value },

        get projectionMatrix() { return base.projectionMatrix; },

        // Extensions
        get aspect(): number { return aspect; },
        set aspect(value: number) { aspect = value },

        updateProjectionMatrix: function() {
            mat4.perspective(base.projectionMatrix, fov, aspect, near, far);
        }
    };

    return that;
};

export =  perspectiveCamera;
