//
// perspectiveCamera.ts
//
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
/// <reference path="../../../src/gl-matrix.d.ts" />
/// <amd-dependency path="gl-matrix" name="glMatrix"/>
import camera = require('davinci-eight/cameras/camera');
declare var glMatrix: glMatrix;

var perspectiveCamera = function(fov: number = 75 * Math.PI / 180, aspect: number = 1, near: number = 0.1, far: number = 2000) {

    var base = camera();

    function updateProjectionMatrix() {
        glMatrix.mat4.perspective(base.projectionMatrix, fov, aspect, near, far);
    }

    updateProjectionMatrix();

    var publicAPI = {
        // Delegate to the base camera.
        get position(): blade.Euclidean3 { return base.position; },
        set position(value) { base.position = value; },
        get attitude(): blade.Euclidean3 { return base.attitude; },
        set attitude(value) { base.attitude = value; },

        // Extensions
        get aspect(): number { return aspect; },
        set aspect(value: number) {
            aspect = value;
            updateProjectionMatrix();
        },

        get projectionMatrix() { return base.projectionMatrix; }
    };

    return publicAPI;
};

export =  perspectiveCamera;
