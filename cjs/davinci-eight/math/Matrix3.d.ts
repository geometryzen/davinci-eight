/// <reference path="../../../src/gl-matrix.d.ts" />
import Matrix4 = require('./Matrix4');
declare class Matrix3 {
    elements: number[];
    constructor();
    identity(): void;
    getInverse(matrix: Matrix4, throwOnInvertible?: boolean): Matrix3;
    multiplyScalar(s: number): Matrix3;
    normalFromMatrix4(m: Matrix4): void;
    transpose(): Matrix3;
}
export = Matrix3;
