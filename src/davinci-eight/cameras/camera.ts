/// <reference path="../../../src/gl-matrix.d.ts" />
/// <amd-dependency path="gl-matrix" name="glMatrix"/>
import object3D = require('davinci-eight/core/functionalConstructorObject3D');
import Vector3 = require('../math/Vector3');
import Spinor3 = require('../math/Spinor3');
declare var glMatrix: glMatrix;

/**
 * @class camera
 */
var camera = function() {

    var base = object3D();
    var projectionMatrix = glMatrix.mat4.create();

    var that = {
        // Delegate to the base camera.
        get position(): Vector3 { return base.position; },
        set position(value) { base.position = value },
        get attitude(): Spinor3 { return base.attitude; },
        set attitude(value) { base.attitude = value },
        get projectionMatrix() {return projectionMatrix}
    };

    return that;
};

export = camera;
