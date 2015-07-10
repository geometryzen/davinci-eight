/// <reference path="../../../src/gl-matrix.d.ts" />
import Vector3 = require('../math/Vector3');
import Spinor3 = require('../math/Spinor3');
declare var perspectiveCamera: (fov?: number, aspect?: number, near?: number, far?: number) => {
    position: Vector3;
    attitude: Spinor3;
    aspect: number;
    projectionMatrix: number[];
};
export = perspectiveCamera;
