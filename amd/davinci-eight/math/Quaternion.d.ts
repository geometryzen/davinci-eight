import Cartesian3 = require('../math/Cartesian3');
import GeometricElement = require('../math/GeometricElement');
import Matrix4 = require('../math/Matrix4');
/**
 * @class Quaternion
 */
declare class Quaternion implements GeometricElement<Quaternion, Quaternion, Quaternion, Cartesian3, Cartesian3> {
    private x;
    private y;
    private z;
    /**
     * The scalar part of the Quaternion.
     * @property t
     * @type {number}
     */
    t: number;
    /**
     *
     * @class Quaternion
     * @constructor
     * @param t [number = 1]
     * @param v [Cartesian3 = {x: 0, y: 0, z: 0}]
     */
    constructor(t?: number, v?: Cartesian3);
    v: Cartesian3;
    /**
     * <p>
     * <code>this ⟼ this + q * α</code>
     * </p>
     * @method add
     * @param q {Quaternion}
     * @param α [number = 1]
     * @return {Quaternion} <code>this</code>
     * @chainable
     */
    add(q: Quaternion, α?: number): Quaternion;
    dual(m: Cartesian3): Quaternion;
    /**
     * <p>
     * <code>this ⟼ a + b = (α, A) + (β, B) = (α + β, A + B)</code>
     * </p>
     * @method sum
     * @param a {Quaternion}
     * @param b {Quaternion}
     * @return {Quaternion} <code>this</code>
     * @chainable
     */
    sum(a: Quaternion, b: Quaternion): Quaternion;
    /**
     * @method clone
     * @return {Quaternion} <code>copy(target)</code>
     */
    clone(): Quaternion;
    /**
     * <p>
     * <code>this = (t, -v)</code>
     * </p>
     * @method conj
     * @return {Quaternion} <code>this</code>
     * @chainable
     */
    conj(): Quaternion;
    copy(quaternion: Quaternion): Quaternion;
    divideByScalar(scalar: number): Quaternion;
    dot(v: Quaternion): number;
    /**
     * <p>
     * <code>this ⟼ exp(t) * (cos(|v|), sin(|v|) * v / |v|)</code>
     * </p>
     * @method exp
     * @return {Quaternion}
     */
    exp(): Quaternion;
    /**
     * @method inv
     * @return {Quaternion} <code>this</code>
     * @chainable
     */
    inv(): Quaternion;
    lerp(target: Quaternion, α: number): Quaternion;
    lerp2(a: Quaternion, b: Quaternion, α: number): Quaternion;
    log(): Quaternion;
    magnitude(): number;
    multiply(q: Quaternion): Quaternion;
    /**
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     * @method norm
     * @return {Quaternion} <code>this</code>
     * @chainable
     */
    norm(): Quaternion;
    /**
     * <p>
     * <code>this ⟼ (a, <b>B</b>)(c, <b>D</b>)</code>
     * </p>
     * @method product
     * @param a {Quaternion}
     * @param b {Quaternion}
     * @return {Quaternion} <code>this</code>
     * @chainable
     */
    product(a: Quaternion, b: Quaternion): Quaternion;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     * @return {Quaternion} <code>this</code>
     * @chainable
     */
    scale(α: number): Quaternion;
    normalize(): Quaternion;
    quaditude(): number;
    reflect(n: Cartesian3): Quaternion;
    rotate(rotor: Quaternion): Quaternion;
    rotor(a: Cartesian3, b: Cartesian3): Quaternion;
    /**
     * <p>
     * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
     * </p>
     * @method rotorFromAxisAngle
     * @param axis {Cartesian3}
     * @param θ {number}
     * @return {Quaternion} <code>this</code>
     * @chainable
     */
    rotorFromAxisAngle(axis: Cartesian3, θ: number): Quaternion;
    setFromRotationMatrix(m: Matrix4): Quaternion;
    spinor(a: Cartesian3, b: Cartesian3): Quaternion;
    slerp(qb: Quaternion, t: number): Quaternion;
    sub(rhs: Quaternion): Quaternion;
    diff(a: Quaternion, b: Quaternion): Quaternion;
    equals(quaternion: Quaternion): boolean;
    fromArray(array: number[], offset?: number): Quaternion;
    toArray(array?: number[], offset?: number): number[];
    static slerp(qa: Quaternion, qb: Quaternion, qm: Quaternion, t: number): Quaternion;
}
export = Quaternion;
