/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
/// <reference path="../../../src/gl-matrix.d.ts" />
declare var perspectiveCamera: (fov?: number, aspect?: number, near?: number, far?: number) => {
    position: blade.Euclidean3;
    attitude: blade.Euclidean3;
    aspect: number;
    projectionMatrix: number[];
};
export = perspectiveCamera;
