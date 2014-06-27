//
// perspectiveCamera.ts
//
import camera = require('eight/cameras/camera');
import glMatrix = require('gl-matrix');
import Euclidean3 = require('eight/math/e3ga/Euclidean3');

var perspectiveCamera = function(fov: number = 50, aspect: number = 1, near: number = 0.1, far: number = 2000) {

    var base = camera();

    function updateProjectionMatrix() {
        glMatrix.mat4.perspective(base.projectionMatrix, fov, aspect, near, far);
    }

    var that = {
        // Delegate to the base camera.
        get position(): Euclidean3 { return base.position; },
        set position(value) { base.position = value; },
        get attitude(): Euclidean3 { return base.attitude; },
        set attitude(value) { base.attitude = value; },

        // Extensions
        get aspect(): number { return aspect; },
        set aspect(value: number) {
            aspect = value;
            updateProjectionMatrix();
        },

        get projectionMatrix() { return base.projectionMatrix; }
    };

    return that;
};

export =  perspectiveCamera;
