import AbstractMatrix = require('../math/AbstractMatrix');
import Matrix4 = require('./Matrix4');
declare class Matrix3 extends AbstractMatrix {
    /**
     * Constructs a Matrix4 by wrapping a Float32Array.
     * @constructor
     */
    constructor(data: Float32Array);
    static identity(): Matrix3;
    getInverse(matrix: Matrix4, throwOnInvertible?: boolean): Matrix3;
    identity(): Matrix3;
    multiplyScalar(s: number): Matrix3;
    normalFromMatrix4(m: Matrix4): void;
    set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): Matrix3;
    transpose(): Matrix3;
}
export = Matrix3;
