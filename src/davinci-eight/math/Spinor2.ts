import {Coords} from '../math/Coords';
import dotVectorCartesian from '../math/dotVectorCartesianE2';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import notSupported from '../i18n/notSupported'
import quadSpinor from '../math/quadSpinorE2';
import rotorFromDirections from '../math/rotorFromDirectionsE2';
import SpinorE2 from '../math/SpinorE2';
import VectorE2 from '../math/VectorE2';
import wedgeXY from '../math/wedgeXY';

// Symbolic constants for the coordinate indices into the coords array.
const COORD_SCALAR = 1;
const COORD_PSEUDO = 0;

function one(): number[] {
    const coords = [0, 0];
    coords[COORD_SCALAR] = 1;
    coords[COORD_PSEUDO] = 0;
    return coords;
}

const abs = Math.abs
const atan2 = Math.atan2
const log = Math.log
const cos = Math.cos
const sin = Math.sin
const sqrt = Math.sqrt

/**
 * @class Spinor2
 * @extends Coords
 */
export default class Spinor2 extends Coords implements SpinorE2 {
    /**
     * Constructs a <code>Spinor2</code> from a <code>number[]</code>.
     * For a <em>geometric</em> implementation, use the static methods.
     * @class Spinor2
     * @constructor
     */
    constructor(coordinates: number[] = one(), modified = false) {
        super(coordinates, modified, 2)
    }

    /**
     * The bivector part of this spinor as a number.
     * @property xy
     * @type {number}
     */
    get xy(): number {
        return this.coords[COORD_PSEUDO];
    }
    set xy(xy: number) {
        mustBeNumber('xy', xy)
        this.modified = this.modified || this.xy !== xy;
        this.coords[COORD_PSEUDO] = xy;
    }

    /**
     * The scalar part of this spinor as a number.
     */
    get a(): number {
        return this.coords[COORD_SCALAR];
    }
    set a(α: number) {
        mustBeNumber('α', α)
        this.modified = this.modified || this.a !== α;
        this.coords[COORD_SCALAR] = α;
    }

    /**
     * The pseudoscalar part of this spinor as a number.
     * @property beta
     * @type number
     * @readOnly
     */
    get b(): number {
        return this.coords[COORD_PSEUDO];
    }
    set b(b: number) {
        mustBeNumber('b', b)
        this.modified = this.modified || this.b !== b;
        this.coords[COORD_PSEUDO] = b;
    }

    /**
     * <p>
     * <code>this ⟼ this + α * spinor</code>
     * </p>
     * @method add
     * @param spinor {SpinorE2}
     * @param [α = 1] {number}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    add(spinor: SpinorE2, α = 1): Spinor2 {
        mustBeObject('spinor', spinor)
        mustBeNumber('α', α)
        this.xy += spinor.b * α
        this.a += spinor.a * α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    add2(a: SpinorE2, b: SpinorE2): Spinor2 {
        this.a = a.a + b.a
        this.xy = a.b + b.b
        return this;
    }

    /**
     * Intentionally undocumented.
     */
    addPseudo(β: number): Spinor2 {
        mustBeNumber('β', β)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this + α</code>
     * </p>
     * @method addScalar
     * @param α {number}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    addScalar(α: number): Spinor2 {
        mustBeNumber('α', α)
        this.a += α
        return this
    }

    /**
     * @method adj
     * @return {number}
     * @beta
     */
    adj(): Spinor2 {
        throw new Error('TODO: Spinor2.adj');
    }

    /**
     * @method angle
     * @return {Spinor2}
     */
    angle(): Spinor2 {
        return this.log().grade(2);
    }

    /**
     * @method approx
     * @param n {number}
     * @return {Spinor2}
     * @chainable
     */
    approx(n: number): Spinor2 {
        super.approx(n)
        return this
    }

    /**
     * @method clone
     * @return {Spinor2} A copy of <code>this</code>.
     * @chainable
     */
    clone() {
        const spinor = Spinor2.copy(this)
        spinor.modified = this.modified
        return spinor
    }

    /**
     * <p>
     * <code>this ⟼ (w, -B)</code>
     * </p>
     * @method conj
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    conj() {
        this.xy = -this.xy
        return this
    }

    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copy
     * @param spinor {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    copy(spinor: SpinorE2) {
        mustBeObject('spinor', spinor)
        this.xy = mustBeNumber('spinor.b', spinor.b)
        this.a = mustBeNumber('spinor.a', spinor.a)
        return this;
    }

    /**
     * Sets this spinor to the value of the scalar, <code>α</code>.
     * @method copyScalar
     * @param α {number} The scalar to be copied.
     * @return {Spinor2}
     * @chainable
     */
    copyScalar(α: number): Spinor2 {
        return this.zero().addScalar(α)
    }

    /**
     * Intentionally undocumented.
     */
    copySpinor(spinor: SpinorE2): Spinor2 {
        return this.copy(spinor);
    }

    /**
     * Intentionally undocumented.
     */
    copyVector(vector: VectorE2): Spinor2 {
        // The spinor has no vector components.
        return this.zero()
    }

    cos(): Spinor2 {
        throw new Error("Spinor2.cos")
    }

    cosh(): Spinor2 {
        throw new Error("Spinor2.cosh")
    }

    /**
     * <p>
     * <code>this ⟼ this / s</code>
     * </p>
     * @method div
     * @param s {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    div(s: SpinorE2): Spinor2 {
        return this.div2(this, s)
    }

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
    div2(a: SpinorE2, b: SpinorE2): Spinor2 {
        let a0 = a.a;
        let a1 = a.b;
        let b0 = b.a;
        let b1 = b.b;
        let quadB = quadSpinor(b)
        this.a = (a0 * b0 + a1 * b1) / quadB
        this.xy = (a1 * b0 - a0 * b1) / quadB
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divByScalar
     * @param α {number}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): Spinor2 {
        this.xy /= α
        this.a /= α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     *
     * @method exp
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    exp() {

        const α = this.a
        const β = this.b

        const expA = Math.exp(α)
        // φ is actually the absolute value of one half the rotation angle.
        // The orientation of the rotation gets carried in the bivector components.
        // FIXME: DRY
        const φ = sqrt(β * β)
        const s = expA * (φ !== 0 ? sin(φ) / φ : 1)
        this.a = expA * cos(φ);
        this.b = β * s;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    inv() {
        this.conj()
        this.divByScalar(this.squaredNormSansUnits());
        return this
    }

    /**
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean {
        return this.a === 1 && this.b === 0
    }

    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean {
        return this.a === 0 && this.b === 0
    }

    lco(rhs: SpinorE2) {
        return this.lco2(this, rhs)
    }

    lco2(a: SpinorE2, b: SpinorE2) {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG2(a, b, this)
        return this
    }

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
    // FIXME: Should really be slerp?
    lerp(target: SpinorE2, α: number) {
        var Vector2 = Spinor2.copy(target)
        var Vector1 = this.clone()
        var R = Vector2.mul(Vector1.inv())
        R.log()
        R.scale(α)
        R.exp()
        this.copy(R)
        return this
    }

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
    lerp2(a: SpinorE2, b: SpinorE2, α: number) {
        this.sub2(b, a).scale(α).add(a)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     * @method log
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    log() {
        // FIXME: This is wrong see Geometric2.
        const w = this.a
        const z = this.xy
        // FIXME: DRY
        const bb = z * z
        const Vector2 = sqrt(bb)
        const R0 = abs(w)
        const R = sqrt(w * w + bb)
        this.a = log(R)
        const f = atan2(Vector2, R0) / Vector2
        this.xy = z * f
        return this;
    }

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
    magnitude(): number {
        return sqrt(this.squaredNormSansUnits());
    }

    magnitudeSansUnits(): number {
        return sqrt(this.squaredNormSansUnits());
    }

    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @method mul
     * @param s {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    mul(s: SpinorE2): Spinor2 {
        return this.mul2(this, s)
    }

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
    mul2(a: SpinorE2, b: SpinorE2) {
        let a0 = a.a
        let a1 = a.b
        let b0 = b.a
        let b1 = b.b
        this.a = a0 * b0 - a1 * b1
        this.xy = a0 * b1 + a1 * b0
        return this
    }

    /**
     * @method neg
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    neg(): Spinor2 {
        this.a = -this.a
        this.xy = -this.xy
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ sqrt(this * conj(this))</code>
     * </p>
     * @method norm
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    norm(): Spinor2 {
        const norm = this.magnitudeSansUnits();
        return this.zero().addScalar(norm);
    }

    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method normalize
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    normalize(): Spinor2 {
        const modulus = this.magnitudeSansUnits();
        this.xy = this.xy / modulus;
        this.a = this.a / modulus;
        return this;
    }

    /**
     * Sets this spinor to the identity element for multiplication, <b>1</b>.
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    one() {
        this.a = 1;
        this.xy = 0;
        return this;
    }

    pow(): Spinor2 {
        throw new Error("Spinor2.pow")
    }

    /**
     * <p>
     * <code>this ⟼ this * conj(this)</code>
     * </p>
     * @method quad
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    quad(): Spinor2 {
        const squaredNorm = this.squaredNormSansUnits()
        return this.zero().addScalar(squaredNorm)
    }

    sin(): Spinor2 {
        throw new Error("Spinor2.sin")
    }

    sinh(): Spinor2 {
        throw new Error("Spinor2.sinh")
    }

    /**
     * @method squaredNorm
     * @return {number}
     */
    squaredNorm(): number {
        return this.squaredNormSansUnits()
    }

    /**
     * Intentionally undocumented.
     */
    squaredNormSansUnits(): number {
        return quadSpinor(this)
    }

    rco(rhs: SpinorE2): Spinor2 {
        return this.rco2(this, rhs)
    }

    rco2(a: SpinorE2, b: SpinorE2): Spinor2 {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG2(a, b, this)
        return this
    }

    /**
     * <p>
     * <code>this = (w, B) ⟼ (w, -B)</code>
     * </p>
     * @method reverse
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    rev(): Spinor2 {
        this.xy *= - 1;
        return this;
    }

    /**
     * Sets this Spinor to the value of its reflection in the plane orthogonal to n.
     * The geometric formula for bivector reflection is B' = n * B * n.
     * @method reflect
     * @param n {VectorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE2): Spinor2 {
        let w = this.a;
        let β = this.xy;
        let nx = n.x;
        let ny = n.y;
        let nn = nx * nx + ny * ny
        this.a = nn * w
        this.xy = - nn * β
        return this;
    }

    /**
     * <p>
     * <code>this = ⟼ rotor * this * rev(rotor)</code>
     * </p>
     * @method rotate
     * @param rotor {SpinorE2}
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    rotate(rotor: SpinorE2): Spinor2 {
        console.warn("Spinor2.rotate is not implemented")
        return this;
    }

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
    rotorFromDirections(a: VectorE2, b: VectorE2): Spinor2 {
        rotorFromDirections(a, b, this)
        return this
    }

    /**
     *
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     *
     * @param B
     * @param θ
     * @returns <code>this</code>
     */
    rotorFromGeneratorAngle(B: SpinorE2, θ: number) {
        let φ = θ / 2
        let s = sin(φ)
        this.xy = -B.b * s
        this.a = cos(φ)
        return this
    }

    rotorFromVectorToVector(a: VectorE2, b: VectorE2): Spinor2 {
        rotorFromDirections(a, b, this)
        return this
    }

    scp(rhs: SpinorE2): Spinor2 {
        return this.scp2(this, rhs)
    }
    scp2(a: SpinorE2, b: SpinorE2): Spinor2 {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG2(a, b, this)
        return this
    }
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number}
     * @return {Spinor2} <code>this</code>
     */
    scale(α: number): Spinor2 {
        mustBeNumber('α', α)
        this.xy *= α;
        this.a *= α;
        return this;
    }

    slerp(target: SpinorE2, α: number): Spinor2 {
        const Vector2 = Spinor2.copy(target)
        const Vector1 = this.clone()
        const R = Vector2.mul(Vector1.inv())
        R.log()
        R.scale(α)
        R.exp()
        this.copy(R)
        return this
    }

    stress(σ: VectorE2): Spinor2 {
        throw new Error(notSupported('stress').message)
    }


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
    sub(s: SpinorE2, α = 1): Spinor2 {
        mustBeObject('s', s)
        mustBeNumber('α', α)
        this.xy -= s.b * α
        this.a -= s.a * α
        return this
    }
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
    sub2(a: SpinorE2, b: SpinorE2): Spinor2 {
        this.xy = a.b - b.b
        this.a = a.a - b.a
        return this;
    }
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
    versor(a: VectorE2, b: VectorE2) {

        const ax = a.x
        const ay = a.y
        const bx = b.x
        const by = b.y

        this.a = dotVectorCartesian(ax, ay, bx, by)
        // TODO: Optimize because we aren't using z.
        this.xy = wedgeXY(ax, ay, 0, bx, by, 0)

        return this
    }

    grade(grade: number): Spinor2 {
        mustBeInteger('grade', grade)
        switch (grade) {
            case 0: {
                this.xy = 0;
            }
                break;
            case 2: {
                this.a = 0;
            }
                break;
            default: {
                this.a = 0;
                this.xy = 0;
            }
        }
        return this;
    }

    toExponential(fractionDigits?: number): string {
        // FIXME: Do like others.
        return this.toString()
    }

    toFixed(fractionDigits?: number): string {
        // FIXME: Do like others.
        return this.toString()
    }

    toPrecision(precision?: number): string {
        // FIXME: Do like others.
        return this.toString()
    }

    /**
     * @method toString
     * @return {string} A non-normative string representation of the target.
     */
    toString(radix?: number): string {
        return "Spinor2({β: " + this.xy + ", w: " + this.a + "})"
    }

    ext(rhs: SpinorE2): Spinor2 {
        return this.ext2(this, rhs)
    }
    ext2(a: SpinorE2, b: SpinorE2): Spinor2 {
        // FIXME: How to leverage? Maybe break up? Don't want performance hit.
        // scpG2(a, b, this)
        return this
    }

    /**
     * Sets this spinor to the identity element for addition, <b>0</b>.
     * @return {Spinor2} <code>this</code>
     * @chainable
     */
    zero(): Spinor2 {
        this.a = 0
        this.xy = 0
        return this
    }

    /**
     * @method copy
     * @param spinor {SpinorE2}
     * @return {Spinor2} A copy of the <code>spinor</code> argument.
     * @static
     */
    static copy(spinor: SpinorE2): Spinor2 {
        return new Spinor2().copy(spinor)
    }

    /**
     * @method lerp
     * @param a {SpinorE2}
     * @param b {SpinorE2}
     * @param α {number}
     * @return {Spinor2} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: SpinorE2, b: SpinorE2, α: number): Spinor2 {
        return Spinor2.copy(a).lerp(b, α)
    }

    /**
     * @method one
     * @return {Spinor2}
     * @static
     * @chainable
     */
    static one(): Spinor2 {
        return Spinor2.zero().addScalar(1)
    }

    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     * @method rotorFromDirections
     * @param a {VectorE2} The <em>from</em> vector.
     * @param b {VectorE2} The <em>to</em> vector.
     * @return {Spinor2}
     * @static
     * @chainable
     */
    static rotorFromDirections(a: VectorE2, b: VectorE2): Spinor2 {
        return new Spinor2().rotorFromDirections(a, b)
    }

    /**
     * @method zero
     * @return {Spinor2}
     * @static
     * @chainable
     */
    static zero(): Spinor2 {
        return new Spinor2([0, 0], false)
    }
}
