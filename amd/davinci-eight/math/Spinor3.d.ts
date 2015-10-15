import Cartesian3 = require('../math/Cartesian3');
import VectorN = require('../math/VectorN');
import GeometricElement = require('../math/GeometricElement');
import Mutable = require('../math/Mutable');
import Spinor3Coords = require('../math/Spinor3Coords');
/**
 * @class Spinor3
 */
declare class Spinor3 extends VectorN<number> implements Spinor3Coords, Mutable<number[]>, GeometricElement<Spinor3Coords, Spinor3, Spinor3Coords, Cartesian3, Cartesian3> {
    /**
     * @class Spinor3
     * @constructor
     * @param data [number[] = [0, 0, 0, 1]] Corresponds to the basis e2e3, e3e1, e1e2, 1
     * @param modified [boolean = false]
     */
    constructor(data?: number[], modified?: boolean);
    /**
     * @property yz
     * @type Number
     */
    yz: number;
    /**
     * @property zx
     * @type Number
     */
    zx: number;
    /**
     * @property xy
     * @type Number
     */
    xy: number;
    /**
     * @property w
     * @type Number
     */
    w: number;
    /**
     * @method add
     * @param rhs {Spinor3Coords}
     * @return {Spinor3}
     */
    add(rhs: Spinor3Coords): Spinor3;
    /**
     * @method clone
     * @return {Spinor3}
     */
    clone(): Spinor3;
    /**
     * @method conjugate
     * @return {Spinor3}
     */
    conjugate(): Spinor3;
    /**
     * @method copy
     * @param spinor {Spinor3Coords}
     * @return {Spinor3}
     */
    copy(spinor: Spinor3Coords): Spinor3;
    /**
     * @method difference
     * @param a {Spinor3Coords}
     * @param b {Spinor3Coords}
     * @return {Spinor3}
     */
    difference(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
    divideScalar(scalar: number): Spinor3;
    /**
     * Sets this Spinor to the value of the dual of the vector, I * v.
     * Notice that the dual of a vector is related to the spinor by the right-hand rule.
     * @method dual
     * @param v {Cartesian3} The vector whose dual will be used to set this spinor.
     * @return {Spinor3}
     */
    dual(v: Cartesian3): Spinor3;
    exp(): Spinor3;
    inverse(): Spinor3;
    lerp(target: Spinor3Coords, alpha: number): Spinor3;
    /**
     * @method log
     * @return {Spinor3}
     */
    log(): Spinor3;
    magnitude(): number;
    /**
     * @method multiply
     * @param rhs {Spinor3Coords}
     * @return {Spinor3}
     */
    multiply(rhs: Spinor3Coords): Spinor3;
    /**
     * @method scale
     * @param scalar {number}
     * @return {Spinor3}
     */
    scale(scalar: number): Spinor3;
    product(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
    quaditude(): number;
    reverse(): Spinor3;
    /**
     * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
     * The geometric formula for bivector reflection is B' = n * B * n.
     * @method reflect
     * @param n {Cartesian3}
     * @return {Spinor3}
     */
    reflect(n: Cartesian3): Spinor3;
    rotate(rotor: Spinor3Coords): Spinor3;
    /**
     * Computes a rotor, R, from two unit vectors, where
     * R = (1 + b * a) / sqrt(2 * (1 + b << a))
     * @method rotor
     * @param b {Cartesian3} The ending unit vector
     * @param a {Cartesian3} The starting unit vector
     * @return {Spinor3} The rotor representing a rotation from a to b.
     */
    rotor(b: Cartesian3, a: Cartesian3): Spinor3;
    sub(rhs: Spinor3Coords): Spinor3;
    sum(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
    /**
     * Sets this Spinor3 to the geometric product a * b of the vector arguments.
     * @method spinor
     * @param a {Cartesian3}
     * @param b {Cartesian3}
     * @return {Spinor3}
     */
    spinor(a: Cartesian3, b: Cartesian3): Spinor3;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(): string;
    static copy(spinor: Spinor3Coords): Spinor3;
    static lerp(a: Spinor3Coords, b: Spinor3Coords, alpha: number): Spinor3;
}
export = Spinor3;
