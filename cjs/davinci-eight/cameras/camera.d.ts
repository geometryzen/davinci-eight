/// <reference path="../../../vendor/davinci-blade/amd/davinci-blade.d.ts" />
/// <reference path="../../../src/gl-matrix.d.ts" />
/**
 * @class camera
 */
declare var camera: () => {
    position: blade.Euclidean3;
    attitude: blade.Euclidean3;
    projectionMatrix: number[];
};
export = camera;
