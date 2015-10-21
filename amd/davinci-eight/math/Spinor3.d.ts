import Cartesian3 = require('../math/Cartesian3');
import VectorN = require('../math/VectorN');
import GeometricElement = require('../math/GeometricElement');
import Mutable = require('../math/Mutable');
import Spinor3Coords = require('../math/Spinor3Coords');
/**
 * @class Spinor3
 * @extends VectorN<number>
 */
declare class Spinor3 extends VectorN<number> implements Spinor3Coords, Mutable<number[]>, GeometricElement<Spinor3Coords, Spinor3, Spinor3, Cartesian3, Cartesian3> {
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
     * <p>
     * <code>this ⟼ this + α * spinor</code>
     * </p>
     * @method add
     * @param spinor {Spinor3Coords}
     * @param α [number = 1]
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    add(spinor: Spinor3Coords, α?: number): Spinor3;
    /**
     * @method clone
     * @return {Spinor3} A copy of <code>this</code>.
     * @chainable
     */
    clone(): Spinor3;
    /**
     * <p>
     * <code>this ⟼ (w, -B)</code>
     * </p>
     * @method conj
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    conj(): Spinor3;
    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copy
     * @param spinor {Spinor3Coords}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    copy(spinor: Spinor3Coords): Spinor3;
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method diff
     * @param a {Spinor3Coords}
     * @param b {Spinor3Coords}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    diff(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divideByScalar
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    divideByScalar(α: number): Spinor3;
    /**
     * <p>
     * <code>this ⟼ dual(this)</code>
     * </p>
     * Sets this Spinor to the value of the dual of the vector, I * v.
     * Notice that the dual of a vector is related to the spinor by the right-hand rule.
     * @method dual
     * @param vector {Cartesian3} The vector whose dual will be used to set this spinor.
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    dual(vector: Cartesian3): Spinor3;
    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     * @method exp
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    exp(): Spinor3;
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    inv(): Spinor3;
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {Spinor3Coords}
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    lerp(target: Spinor3Coords, α: number): Spinor3;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * <p>
     * @method lerp2
     * @param a {Spinor3Coords}
     * @param b {Spinor3Coords}
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    lerp2(a: Spinor3Coords, b: Spinor3Coords, α: number): Spinor3;
    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     * @method log
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    log(): Spinor3;
    magnitude(): number;
    /**
     * <p>
     * <code>this ⟼ this * rhs</code>
     * </p>
     * @method multiply
     * @param rhs {Spinor3Coords}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    multiply(rhs: Spinor3Coords): Spinor3;
    /**
    * <p>
    * <code>this ⟼ sqrt(this * conj(this))</code>
    * </p>
    * @method norm
    * @return {Spinor3} <code>this</code>
    * @chainable
    */
    norm(): Spinor3;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     */
    scale(α: number): Spinor3;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method product
     * @param a {Spinor3Coords}
     * @param b {Spinor3Coords}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    product(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
    /**
     * @method quaditude
     * @return {number} <code>this * conj(this)</code>
     */
    quaditude(): number;
    /**
     * <p>
     * <code>this = (w, B) ⟼ (w, -B)</code>
     * </p>
     * @method reverse
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    reverse(): Spinor3;
    /**
     * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
     * The geometric formula for bivector reflection is B' = n * B * n.
     * @method reflect
     * @param n {Cartesian3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    reflect(n: Cartesian3): Spinor3;
    /**
     * <p>
     * <code>this = ⟼ rotor * this * reverse(rotor)</code>
     * </p>
     * @method rotate
     * @param rotor {Spinor3Coords}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    rotate(rotor: Spinor3Coords): Spinor3;
    /**
     * <p>
     * Computes a rotor, R, from two unit vectors, where
     * R = (1 + b * a) / sqrt(2 * (1 + b << a))
     * </p>
     * @method rotor
     * @param b {Cartesian3} The ending unit vector
     * @param a {Cartesian3} The starting unit vector
     * @return {Spinor3} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotor(b: Cartesian3, a: Cartesian3): Spinor3;
    /**
     * <p>
     * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
     * </p>
     * @method rotorFromAxisAngle
     * @param axis {Cartesian3}
     * @param θ {number}
     * @return {Spinor3} <code>this</code>
     */
    rotorFromAxisAngle(axis: Cartesian3, θ: number): Spinor3;
    /**
     * <p>
     * <code>this ⟼ this - rhs</code>
     * </p>
     * @method sub
     * @param rhs {Spinor3Coords}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    sub(rhs: Spinor3Coords): Spinor3;
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method sum
     * @param a {Spinor3Coords}
     * @param b {Spinor3Coords}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    sum(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
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
    /**
     * @method copy
     * @param spinor {Spinor3Coords}
     * @return {Spinor3} A copy of the <code>spinor</code> argument.
     * @static
     */
    static copy(spinor: Spinor3Coords): Spinor3;
    /**
     * @method lerp
     * @param a {Spinor3Coords}
     * @param b {Spinor3Coords}
     * @param α {number}
     * @return {Spinor3} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: Spinor3Coords, b: Spinor3Coords, α: number): Spinor3;
}
export = Spinor3;
