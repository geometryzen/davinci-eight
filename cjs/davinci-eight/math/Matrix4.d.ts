import Spinor3Coords = require('../math/Spinor3Coords');
import Cartesian3 = require('../math/Cartesian3');
/**
 * 4x4 matrix integrating with WebGL.
 * @class Matrix4
 *
 * The correspondence between the elements property index and the matrix entries is...
 *
 *  0  4  8 12
 *  1  5  9 13
 *  2  6 10 14
 *  3  7 11 15
 */
declare class Matrix4 {
    /**
     * @property elements
     * @type Float32Array
     */
    elements: Float32Array;
    /**
     * Constructs the Matrix4 initialized to the identity matrix.
     * @constructor
     */
    constructor(elements: Float32Array);
    static create(): Matrix4;
    identity(): Matrix4;
    /**
     *
     */
    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    makeRotationAxis(axis: Cartesian3, angle: number): Matrix4;
    mul(m: Matrix4): Matrix4;
    multiplyMatrices(a: Matrix4, b: Matrix4): Matrix4;
    /**
     * Sets the elements of the target matrix to the perspective transformation.
     * The perspective transformation maps homogeneous world coordinates into
     * a cubic viewing volume such that an orthogonal projection of that viewing
     * volume will give the correct linear perspective.
     * @method perspective
     * @param fov {Number} field of view in the vertical direction, measured in radians.
     * @param aspect {Number} The ratio of view width divided by view height.
     * @param near {Number} The distance to the near field plane.
     * @param far {Number} The distance to the far field plane.
     */
    perspective(fov: number, aspect: number, near: number, far: number): Matrix4;
    /**
     * @method rotate
     * @param attitude  The spinor from which the rotation will be computed.
     */
    rotate(spinor: Spinor3Coords): Matrix4;
    /**
     * @method
     * @param i {number} the zero-based index of the row.
     */
    row(i: number): number[];
    scale(x: number, y: number, z: number): Matrix4;
    set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number, n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number): Matrix4;
    toFixed(n: number): string;
    toString(): string;
    translate(position: Cartesian3): Matrix4;
}
export = Matrix4;
