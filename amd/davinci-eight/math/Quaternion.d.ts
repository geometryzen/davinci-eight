import GeometricElement = require('../math/GeometricElement');
import Matrix4 = require('../math/Matrix4');
import VectorE3 = require('../math/VectorE3');
/**
 * @class Quaternion
 */
declare class Quaternion implements GeometricElement<Quaternion, Quaternion, Quaternion, VectorE3, VectorE3> {
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
     * @param v [VectorE3 = 0]
     */
    constructor(t?: number, v?: VectorE3);
    v: VectorE3;
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
    dual(m: VectorE3): Quaternion;
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
    reflect(n: VectorE3): Quaternion;
    rotate(rotor: Quaternion): Quaternion;
    rotor(a: VectorE3, b: VectorE3): Quaternion;
    /**
     * <p>
     * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
     * </p>
     * @method rotorFromAxisAngle
     * @param axis {VectorE3}
     * @param θ {number}
     * @return {Quaternion} <code>this</code>
     * @chainable
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): Quaternion;
    setFromRotationMatrix(m: Matrix4): Quaternion;
    spinor(a: VectorE3, b: VectorE3): Quaternion;
    slerp(qb: Quaternion, t: number): Quaternion;
    sub(rhs: Quaternion): Quaternion;
    diff(a: Quaternion, b: Quaternion): Quaternion;
    equals(quaternion: Quaternion): boolean;
    fromArray(array: number[], offset?: number): Quaternion;
    toArray(array?: number[], offset?: number): number[];
    static slerp(qa: Quaternion, qb: Quaternion, qm: Quaternion, t: number): Quaternion;
}
export = Quaternion;
