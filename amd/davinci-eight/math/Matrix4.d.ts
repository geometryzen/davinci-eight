import Spinor3Coords = require('../math/Spinor3Coords');
import Cartesian3 = require('../math/Cartesian3');
/**
 * 4x4 matrix integrating with WebGL.
 *
 * @class Matrix4
 */
declare class Matrix4 {
    /**
     * @property elements
     * @type Float32Array
     */
    elements: Float32Array;
    /**
     * Constructs the Matrix4 by wrapping a Float32Array.
     * @constructor
     */
    constructor(elements: Float32Array);
    static identity(): Matrix4;
    static scaling(scale: Cartesian3): Matrix4;
    static translation(vector: Cartesian3): Matrix4;
    static rotation(spinor: Spinor3Coords): Matrix4;
    clone(): Matrix4;
    compose(scale: Cartesian3, attitude: Spinor3Coords, position: Cartesian3): Matrix4;
    copy(m: Matrix4): Matrix4;
    determinant(): number;
    invert(m: Matrix4, throwOnSingular?: boolean): Matrix4;
    identity(): Matrix4;
    multiplyScalar(s: any): Matrix4;
    transpose(): Matrix4;
    /**
     *
     */
    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    rotationAxis(axis: Cartesian3, angle: number): Matrix4;
    mul(m: Matrix4): Matrix4;
    multiplyMatrices(a: Matrix4, b: Matrix4): Matrix4;
    static mul(ae: Float32Array, be: Float32Array, oe: Float32Array): Float32Array;
    rotate(spinor: Spinor3Coords): Matrix4;
    /**
     * @method rotate
     * @param attitude  The spinor from which the rotation will be computed.
     */
    rotation(spinor: Spinor3Coords): Matrix4;
    /**
     * @method
     * @param i {number} the zero-based index of the row.
     */
    row(i: number): number[];
    /**
     *
     */
    scale(scale: Cartesian3): Matrix4;
    scaling(scale: Cartesian3): Matrix4;
    set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number, n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number): Matrix4;
    toFixed(digits?: number): string;
    toString(): string;
    translate(displacement: Cartesian3): Matrix4;
    translation(displacement: Cartesian3): Matrix4;
    __mul__(other: any): Matrix4;
    __rmul__(other: any): Matrix4;
}
export = Matrix4;
