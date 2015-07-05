/// <reference path="../../../src/gl-matrix.d.ts" />
import Matrix4 = require('./Matrix4');
declare class Matrix3 {
    elements: number[];
    constructor();
    identity(): void;
    normalFromMatrix4(matrix: Matrix4): void;
}
export = Matrix3;
