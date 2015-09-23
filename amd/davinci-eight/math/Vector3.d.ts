import Cartesian3 = require('../math/Cartesian3');
import LinearElement = require('../math/LinearElement');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import Spinor3Coords = require('../math/Spinor3Coords');
import VectorN = require('../math/VectorN');
/**
 * @class Vector3
 */
declare class Vector3 extends VectorN<number> implements Cartesian3, LinearElement<Cartesian3, Vector3, Spinor3Coords> {
    static e1: Vector3;
    static e2: Vector3;
    static e3: Vector3;
    static dot(a: Cartesian3, b: Cartesian3): number;
    /**
     * @class Vector3
     * @constructor
     * @param data {number[]} Default is [0, 0, 0].
     * @param modified {boolean} Default is false;
     */
    constructor(data?: number[], modified?: boolean);
    /**
     * @property x
     * @type Number
     */
    x: number;
    /**
     * @property y
     * @type Number
     */
    y: number;
    /**
     * @property z
     * @type Number
     */
    z: number;
    /**
     * Performs in-place addition of vectors.
     *
     * @method add
     * @param v {Vector3} The vector to add to this vector.
     */
    add(v: Cartesian3): Vector3;
    sum(a: Cartesian3, b: Cartesian3): Vector3;
    applyMatrix3(m: Matrix3): Vector3;
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     * Strictly speaking, this method does not make much sense because the dimensions
     * of the square matrix and column vector don't match.
     * TODO: Used by TubeGeometry.
     * @method applyMatrix
     * @param m The 4x4 matrix that pre-multiplies this column vector.
     */
    applyMatrix4(m: Matrix4): Vector3;
    rotate(spinor: Spinor3Coords): Vector3;
    clone(): Vector3;
    copy(v: Cartesian3): Vector3;
    cross(v: Cartesian3): Vector3;
    crossVectors(a: Cartesian3, b: Cartesian3): Vector3;
    distanceTo(position: Cartesian3): number;
    quadranceTo(position: Cartesian3): number;
    divideScalar(scalar: number): Vector3;
    dot(v: Cartesian3): number;
    magnitude(): number;
    quaditude(): number;
    lerp(target: Cartesian3, alpha: number): Vector3;
    normalize(): Vector3;
    multiply(v: Cartesian3): Vector3;
    multiplyScalar(scalar: number): Vector3;
    set(x: number, y: number, z: number): Vector3;
    setMagnitude(magnitude: number): Vector3;
    setX(x: number): Vector3;
    setY(y: number): Vector3;
    setZ(z: number): Vector3;
    sub(v: Cartesian3): Vector3;
    difference(a: Cartesian3, b: Cartesian3): Vector3;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string;
    __add__(rhs: Vector3): Vector3;
    __mul__(rhs: number): Vector3;
    /**
     * @method copy
     * Copy constructor.
     */
    static copy(vector: Cartesian3): Vector3;
}
export = Vector3;
