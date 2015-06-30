/// <reference path="../../../vendor/davinci-blade/amd/davinci-blade.d.ts" />
/// <reference path="../../../src/gl-matrix.d.ts" />
/// <amd-dependency path="gl-matrix" name="glMatrix"/>
var object3D = require('davinci-eight/core/object3D');
/**
 * @class camera
 */
var camera = function () {
    var base = object3D();
    var projectionMatrix = glMatrix.mat4.create();
    var that = {
        // Delegate to the base camera.
        get position() { return base.position; },
        set position(value) { base.position = value; },
        get attitude() { return base.attitude; },
        set attitude(value) { base.attitude = value; },
        get projectionMatrix() { return projectionMatrix; }
    };
    return that;
};
module.exports = camera;
