import { LockableMixin as Lockable } from '../core/Lockable';
import { Pseudo } from './Pseudo';
import { SpinorE2 } from '../math/SpinorE2';
import { VectorE2 } from '../math/VectorE2';
import { VectorN } from '../atoms/VectorN';
/**
 *
 */
export declare class Spinor2 implements SpinorE2, Lockable, VectorN<number> {
    isLocked: () => boolean;
    lock: () => number;
    unlock: (token: number) => void;
    /**
     *
     */
    private coords_;
    /**
     *
     */
    private modified_;
    /**
     *
     */
    constructor(coords?: number[], modified?: boolean);
    readonly length: number;
    modified: boolean;
    getComponent(i: number): number;
    /**
     * The bivector part of this spinor as a number.
     */
    xy: number;
    /**
     * The scalar part of this spinor as a number.
     */
    a: number;
    /**
     * The pseudoscalar part of this spinor as a number.
     */
    b: number;
    /**
     *
     * <code>this ⟼ this + α * spinor</code>
     *
     * @param spinor
     * @param α
     * @return this
     */
    add(spinor: SpinorE2, α?: number): Spinor2;
    /**
     *
     * this ⟼ a + b
     *
     * @param a
     * @param b
     * @return this
     */
    add2(a: SpinorE2, b: SpinorE2): Spinor2;
    /**
     * Intentionally undocumented.
     */
    addPseudo(β: number): Spinor2;
    /**
     * this ⟼ this + α
     *
     * @param α
     * @return this
     */
    addScalar(α: number): Spinor2;
    /**
     * arg(A) = grade(log(A), 2)
     */
    arg(): Spinor2;
    /**
     *
     */
    approx(n: number): this;
    /**
     * @return A copy of this
     */
    clone(): Spinor2;
    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     *
     * @returns conj(this)
     */
    conj(): this;
    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copy
     * @param spinor {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    copy(spinor: SpinorE2): this;
    /**
     * Sets this spinor to the value of the scalar, <code>α</code>.
     * @method copyScalar
     * @param α {number} The scalar to be copied.
     * @return {Spinor2}
     * @chainable
     */
    copyScalar(α: number): Spinor2;
    /**
     * Intentionally undocumented.
     */
    copySpinor(spinor: SpinorE2): Spinor2;
    /**
     * Intentionally undocumented.
     */
    copyVector(vector: VectorE2): Spinor2;
    cos(): Spinor2;
    cosh(): Spinor2;
    /**
     * <p>
     * <code>this ⟼ this / s</code>
     * </p>
     * @method div
     * @param s {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    div(s: SpinorE2): Spinor2;
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method div2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    div2(a: SpinorE2, b: SpinorE2): Spinor2;
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divByScalar
     * @param α {number}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): Spinor2;
    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     *
     * @method exp
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    exp(): this;
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    inv(): this;
    /**
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean;
    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean;
    lco(rhs: SpinorE2): this;
    lco2(a: SpinorE2, b: SpinorE2): this;
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {SpinorE2}
     * @param α {number}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    lerp(target: SpinorE2, α: number): this;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * <p>
     * @method lerp2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @param α {number}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    lerp2(a: SpinorE2, b: SpinorE2, α: number): this;
    /**
     * this ⟼ log(this)
     *
     * @returns log(this)
     */
    log(): Spinor2;
    /**
     * <p>
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * </p>
     * <p>
     * This method does not change this spinor.
     * </p>
     *
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @method mul
     * @param s {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    mul(s: SpinorE2): Spinor2;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method mul2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    mul2(a: SpinorE2, b: SpinorE2): this;
    /**
     * @method neg
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    neg(): Spinor2;
    /**
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     * @method norm
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    norm(): Spinor2;
    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method normalize
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    normalize(): Spinor2;
    /**
     * Sets this spinor to the identity element for multiplication, <b>1</b>.
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    one(): this;
    pow(): Spinor2;
    /**
     * @returns The square of the magnitude.
     */
    quaditude(): number;
    sin(): Spinor2;
    sinh(): Spinor2;
    /**
     * <p>
     * <code>this ⟼ this * conj(this)</code>
     * </p>
     * @method quad
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    squaredNorm(): Spinor2;
    rco(rhs: SpinorE2): Spinor2;
    rco2(a: SpinorE2, b: SpinorE2): Spinor2;
    /**
     * <p>
     * <code>this = (w, B) ⟼ (w, -B)</code>
     * </p>
     * @method reverse
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    rev(): Spinor2;
    /**
     * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
     * The geometric formula for bivector reflection is B' = n * B * n.
     */
    reflect(n: VectorE2): Spinor2;
    /**
     * <p>
     * <code>this = ⟼ rotor * this * rev(rotor)</code>
     * </p>
     * @method rotate
     * @param rotor {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    rotate(rotor: SpinorE2): Spinor2;
    /**
     * <p>
     * Sets this multivector to a rotation from vector <code>a</code> to vector <code>b</code>.
     * </p>
     * @method rotorFromDirections
     * @param a {VectorE2} The <em>from</em> vector.
     * @param b {VectorE2} The <em>to</em> vector.
     * @return {Spinor2} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotorFromDirections(a: VectorE2, b: VectorE2): Spinor2;
    /**
     *
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     *
     * @param B
     * @param θ
     * @returns <code>this</code>
     */
    rotorFromGeneratorAngle(B: SpinorE2, θ: number): this;
    rotorFromVectorToVector(a: VectorE2, b: VectorE2): Spinor2;
    scp(rhs: SpinorE2): Spinor2;
    scp2(a: SpinorE2, b: SpinorE2): Spinor2;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     * @return {Spinor2} <code>this</code>
     */
    scale(α: number): Spinor2;
    stress(σ: VectorE2): Spinor2;
    /**
     * <p>
     * <code>this ⟼ this - s * α</code>
     * </p>
     * @method sub
     * @param s {SpinorE2}
     * @param [α = 1] {number}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    sub(s: SpinorE2, α?: number): Spinor2;
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    sub2(a: SpinorE2, b: SpinorE2): Spinor2;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this Spinor2 to the geometric product a * b of the vector arguments.
     *
     * @method versor
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @return {Spinor2}
     */
    versor(a: VectorE2, b: VectorE2): this;
    grade(i: number): Spinor2;
    /**
     *
     */
    toArray(): number[];
    toExponential(fractionDigits?: number): string;
    toFixed(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(radix?: number): string;
    ext(rhs: SpinorE2): Spinor2;
    ext2(a: SpinorE2, b: SpinorE2): Spinor2;
    /**
     * Sets this spinor to the identity element for addition, 0
     */
    zero(): Spinor2;
    static copy(spinor: SpinorE2): Spinor2;
    static fromBivector(B: Pseudo): Spinor2;
    /**
     * a + α * (b - a)
     */
    static lerp(a: SpinorE2, b: SpinorE2, α: number): Spinor2;
    /**
     *
     */
    static one(): Spinor2;
    /**
     * Computes the rotor that rotates vector a to vector b.
     */
    static rotorFromDirections(a: VectorE2, b: VectorE2): Spinor2;
    /**
     *
     */
    static zero(): Spinor2;
}
