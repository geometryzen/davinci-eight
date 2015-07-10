/// <reference path="../../../src/gl-matrix.d.ts" />
import Vector3 = require('../math/Vector3');
import Spinor3 = require('../math/Spinor3');
/**
 * @class camera
 */
declare var camera: () => {
    position: Vector3;
    attitude: Spinor3;
    projectionMatrix: number[];
};
export = camera;
