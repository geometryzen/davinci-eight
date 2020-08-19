import { BivectorE3 } from './BivectorE3';
import { CartesianG3 } from './CartesianG3';
import { LockableMixin as Lockable } from '../core/Lockable';
import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from './VectorE3';
import { VectorN } from '../atoms/VectorN';
/**
 * A Geometric Number representing the even sub-algebra of G3.
 */
export declare class Spinor3 implements CartesianG3, SpinorE3, Lockable, VectorN<number> {
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
     * Initializes the spinor from the specified coordinates.
     * The spinor is not locked.
     * The spinor is not modified.
     * @param coords [yz, zx, xy, a]
     * @param code
     */
    constructor(coords: number[], code: number);
    get modified(): boolean;
    set modified(modified: boolean);
    /**
     * The coordinate corresponding to the <b>e</b><sub>23</sub> basis bivector.
     */
    get yz(): number;
    set yz(yz: number);
    /**
     * The coordinate corresponding to the <b>e</b><sub>31</sub> basis bivector.
     */
    get zx(): number;
    set zx(zx: number);
    /**
     * The coordinate corresponding to the <b>e</b><sub>12</sub> basis bivector.
     */
    get xy(): number;
    set xy(xy: number);
    /**
     * The coordinate corresponding to the <b>1</b> basis scalar.
     */
    get a(): number;
    set a(α: number);
    get length(): number;
    /**
     *
     */
    get maskG3(): number;
    set maskG3(unused: number);
    /**
     * <p>
     * <code>this ⟼ this + α * spinor</code>
     * </p>
     * @param spinor
     * @param α
     * @returns this + α * spinor
     */
    add(spinor: SpinorE3, α?: number): this;
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     *
     * @param a
     * @param b
     * @returns a + b
     */
    add2(a: SpinorE3, b: SpinorE3): Spinor3;
    /**
     * Intentionally undocumented.
     * @return this + I * β
     */
    addPseudo(β: number): Spinor3;
    /**
     * this ⟼ this + α
     *
     * @param α
     * @returns this + α
     */
    addScalar(α: number): Spinor3;
    /**
     * arg(A) = grade(log(A), 2)
     *
     * @returns arg(this)
     */
    arg(): Spinor3;
    /**
     *
     */
    approx(n: number): this;
    /**
     * Returns an unlocked (mutable) copy of `this`.
     */
    clone(): Spinor3;
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
     * <code>this ⟼ copy(source)</code>
     * </p>
     *
     * @method copy
     * @param source {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    copy(source: SpinorE3): Spinor3;
    copyCoordinates(coordinates: number[]): Spinor3;
    /**
     * Sets this spinor to the value of the scalar, <code>α</code>.
     *
     * @method copyScalar
     * @param α {number} The scalar to be copied.
     * @return {Spinor3}
     * @chainable
     */
    copyScalar(α: number): Spinor3;
    /**
     * Intentionally undocumented.
     */
    copySpinor(s: SpinorE3): Spinor3;
    /**
     * Intentionally undocumented.
     */
    copyVector(vector: VectorE3): Spinor3;
    /**
     * <p>
     * <code>this ⟼ this / s</code>
     * </p>
     *
     * @method div
     * @param s {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    div(s: SpinorE3): Spinor3;
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     *
     * @method div2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    div2(a: SpinorE3, b: SpinorE3): this;
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     *
     * @method divByScalar
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): Spinor3;
    /**
     * <p>
     * <code>this ⟼ dual(v) = I * v</code>
     * </p>
     *
     * @method dual
     * @param v {VectorE3} The vector whose dual will be used to set this spinor.
     * @param changeSign {boolean}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    dual(v: VectorE3, changeSign: boolean): Spinor3;
    equals(other: any): boolean;
    /**
     * <code>this ⟼ e<sup>this</sup></code>
     *
     * @returns exp(this)
     */
    exp(): Spinor3;
    getComponent(index: number): number;
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     *
     * @method inv
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    inv(): Spinor3;
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
    /**
     * @method lco
     * @param rhs {Spinor3}
     * @return {Spinor3}
     * @chainable
     */
    lco(rhs: SpinorE3): Spinor3;
    /**
     *
     */
    lco2(a: SpinorE3, b: SpinorE3): Spinor3;
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     *
     * @method lerp
     * @param target {SpinorE3}
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    lerp(target: SpinorE3, α: number): Spinor3;
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * <p>
     *
     * @method lerp2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    lerp2(a: SpinorE3, b: SpinorE3, α: number): Spinor3;
    /**
     * this ⟼ log(this)
     */
    log(): this;
    /**
     * <p>
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * </p>
     * <p>
     * This method does not change this multivector.
     * </p>
     *
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    /**
     * Intentionally undocumented.
     */
    magnitudeSansUnits(): number;
    /**
     * <p>
     * <code>this ⟼ this * rhs</code>
     * </p>
     *
     * @method mul
     * @param rhs {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    mul(rhs: SpinorE3): Spinor3;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     *
     * @method mul2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    mul2(a: SpinorE3, b: SpinorE3): Spinor3;
    /**
     * @method neg
     *
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    neg(): Spinor3;
    /**
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     *
     * @method norm
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    norm(): Spinor3;
    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     *
     * @method normalize
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    normalize(): Spinor3;
    /**
     * Sets this spinor to the identity element for multiplication, <b>1</b>.
     *
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    one(): this;
    /**
     * <p>
     * <code>this ⟼ this * conj(this)</code>
     * </p>
     *
     * @method quad
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    quad(): Spinor3;
    /**
     * <p>
     * This method does not change this multivector.
     * </p>
     *
     * @method squaredNorm
     * @return {number}
     */
    squaredNorm(): number;
    /**
     * Intentionally undocumented.
     */
    squaredNormSansUnits(): number;
    /**
     * @method stress
     * @param σ {VectorE3}
     * @return {Spinor3}
     * @chainable
     */
    stress(σ: VectorE3): Spinor3;
    rco(rhs: SpinorE3): Spinor3;
    rco2(a: SpinorE3, b: SpinorE3): Spinor3;
    /**
     * <p>
     * <code>this = (w, B) ⟼ (w, -B)</code>
     * </p>
     *
     * @method rev
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    rev(): Spinor3;
    /**
     * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
     * The geometric formula for bivector reflection is B' = n * B * n.
     *
     * @method reflect
     * @param n {VectorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3): this;
    /**
     * <p>
     * <code>this = ⟼ R * this * rev(R)</code>
     * </p>
     *
     * @method rotate
     * @param R {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    rotate(R: SpinorE3): Spinor3;
    /**
     * <p>
     * Computes a rotor, R, from two vectors, where
     * R = (abs(b) * abs(a) + b * a) / sqrt(2 * (quad(b) * quad(a) + abs(b) * abs(a) * b << a))
     * </p>
     *
     * @method rotorFromDirections
     * @param a {VectorE3} The <em>from</em> vector.
     * @param b {VectorE3} The <em>to</em> vector.
     * @return {Spinor3} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotorFromDirections(a: VectorE3, b: VectorE3): Spinor3;
    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     *
     * @param B The unit bivector that generates the rotation.
     * @param θ The rotation angle in radians.
     */
    rotorFromGeneratorAngle(B: BivectorE3, θ: number): this;
    rotorFromVectorToVector(a: VectorE3, b: VectorE3, B: BivectorE3): Spinor3;
    scp(rhs: SpinorE3): Spinor3;
    scp2(a: SpinorE3, b: SpinorE3): Spinor3;
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     *
     * @method scale
     * @param α {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    scale(α: number): Spinor3;
    /**
     * <p>
     * <code>this ⟼ this - s * α</code>
     * </p>
     *
     * @method sub
     * @param s {SpinorE3}
     * @param [α = 1] {number}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    sub(s: SpinorE3, α?: number): Spinor3;
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     *
     * @method sub2
     * @param a {SpinorE3}
     * @param b {SpinorE3}
     * @return {Spinor3} <code>this</code>
     * @chainable
     */
    sub2(a: SpinorE3, b: SpinorE3): Spinor3;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     *
     * Sets this Spinor3 to the geometric product, a * b, of the vector arguments.
     *
     * @param a
     * @param b
     */
    versor(a: VectorE3, b: VectorE3): this;
    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     *
     * Sets this Spinor3 to the exterior product, a ^ b, of the vector arguments.
     *
     * @method wedge
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {Spinor3}
     * @chainable
     */
    wedge(a: VectorE3, b: VectorE3): Spinor3;
    /**
     * @method grade
     * @param grade {number}
     * @return {Spinor3}
     * @chainable
     */
    grade(grade: number): this;
    /**
     *
     */
    toArray(): number[];
    /**
     * @method toExponential
     * @param [fractionDigits] {number}
     * @return {string}
     */
    toExponential(fractionDigits?: number): string;
    /**
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    toFixed(fractionDigits?: number): string;
    /**
     * @method toPrecision
     * @param [position] {number}
     * @return {string}
     */
    toPrecision(position?: number): string;
    /**
     * @method toString
     * @param [radix] {number}
     * @return {string} A non-normative string representation of the target.
     */
    toString(radix?: number): string;
    ext(rhs: SpinorE3): Spinor3;
    ext2(a: SpinorE3, b: SpinorE3): Spinor3;
    /**
     * Sets this spinor to the identity element for addition, <b>0</b>.
     *
     * @return {Spinor3} <code>this</code>
     */
    zero(): Spinor3;
    /**
     * @param spinor The spinor to be copied.
     * @returns A copy of the spinor argument.
     */
    static copy(spinor: SpinorE3): Spinor3;
    /**
     * Computes I * v, the dual of v.
     *
     * @param v
     * @param changeSign
     * @returns I * v
     */
    static dual(v: VectorE3, changeSign: boolean): Spinor3;
    static fromBivector(B: BivectorE3): Spinor3;
    /**
     *
     */
    static isOne(spinor: SpinorE3): boolean;
    /**
     * @param a
     * @param b
     * @param α
     * @returns a + α * (b - a)
     */
    static lerp(a: SpinorE3, b: SpinorE3, α: number): Spinor3;
    /**
     * <p>
     * Computes a unit spinor with a random direction.
     * </p>
     */
    static random(): Spinor3;
    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     *
     * @param a The <em>from</em> vector.
     * @param b The <em>to</em> vector.
     */
    static rotorFromDirections(a: VectorE3, b: VectorE3): Spinor3;
    /**
     * Constructs a new Spinor3 from coordinates.
     * The returned spinor is not locked.
     * The returned spinor is not modified.
     * @param yz The coordinate corresponding to the e2e3 basis bivector.
     * @param zx The coordinate corresponding to the e3e1 basis bivector.
     * @param xy The coordinate corresponding to the e1e2 basis bivector.
     * @param a The coordinate corresponding to the 1 basis scalar.
     */
    static spinor(yz: number, zx: number, xy: number, a: number): Spinor3;
    /**
     * A spinor with the value of 1.
     * The spinor is not modified (initially).
     * The spinor is not locked (initially).
     * @deprecated This value may become locked in future. User Spinor3.spinor(0, 0, 0, 1) instead.
     */
    static readonly one: Spinor3;
    /**
     * @param a
     * @param b
     */
    static wedge(a: VectorE3, b: VectorE3): Spinor3;
    /**
     * A spinor with the value of 0.
     * The spinor is not modified (initially).
     * The spinor is not locked (initially).
     * @deprecated This value may become locked in future. User Spinor3.spinor(0, 0, 0, 0) instead.
     */
    static readonly zero: Spinor3;
}
