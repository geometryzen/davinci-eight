import AbstractMatrix = require('../math/AbstractMatrix');
import Matrix = require('../math/Matrix');
import SpinorE3 = require('../math/SpinorE3');
import VectorE3 = require('../math/VectorE3');
/**
 * @class Matrix4
 * @extends AbstractMatrix
 */
declare class Matrix4 extends AbstractMatrix implements Matrix<Matrix4> {
    /**
     * 4x4 (square) matrix of numbers.
     * Constructs a Matrix4 by wrapping a Float32Array.
     * @class Matrix4
     * @constructor
     */
    constructor(data: Float32Array);
    /**
     * <p>
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     * </p>
     * @method identity
     * @return {Matrix3}
     * @static
     */
    static identity(): Matrix4;
    /**
     * <p>
     * Creates a new matrix with all elements zero.
     * </p>
     * @method zero
     * @return {Matrix4}
     * @static
     */
    static zero(): Matrix4;
    static scaling(scale: VectorE3): Matrix4;
    static translation(vector: VectorE3): Matrix4;
    static rotation(spinor: SpinorE3): Matrix4;
    /**
     * Returns a copy of this Matrix4 instance.
     * @method clone
     * @return {Matrix}
     */
    clone(): Matrix4;
    compose(scale: VectorE3, attitude: SpinorE3, position: VectorE3): Matrix4;
    copy(m: Matrix4): Matrix4;
    determinant(): number;
    invert(m: Matrix4, throwOnSingular?: boolean): Matrix4;
    identity(): Matrix4;
    scale(s: number): Matrix4;
    /**
     * @method transpose
     * @return {Matrix4}
     */
    transpose(): Matrix4;
    /**
     *
     */
    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    rotationAxis(axis: VectorE3, angle: number): Matrix4;
    multiply(rhs: Matrix4): Matrix4;
    product(a: Matrix4, b: Matrix4): Matrix4;
    rotate(spinor: SpinorE3): Matrix4;
    /**
     * @method rotate
     * @param attitude  The spinor from which the rotation will be computed.
     */
    rotation(spinor: SpinorE3): Matrix4;
    /**
     * @method row
     * @param i {number} the zero-based index of the row.
     * @return {number[]}
     */
    row(i: number): number[];
    scaleXYZ(scale: VectorE3): Matrix4;
    scaling(scale: VectorE3): Matrix4;
    set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number, n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number): Matrix4;
    toFixed(digits?: number): string;
    toString(): string;
    translate(displacement: VectorE3): Matrix4;
    translation(displacement: VectorE3): Matrix4;
    __mul__(other: any): Matrix4;
    __rmul__(other: any): Matrix4;
}
export = Matrix4;
