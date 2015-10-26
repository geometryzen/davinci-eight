import dotVectorsE2 = require('../math/dotVectorsE2')
import euclidean3Quaditude1Arg = require('../math/euclidean3Quaditude1Arg')
import euclidean3Quaditude2Arg = require('../math/euclidean3Quaditude2Arg')
import extE2 = require('../math/extE2')
import GeometricE2 = require('../math/GeometricE2')
import isNumber = require('../checks/isNumber')
import isObject = require('../checks/isObject')
import lcoE2 = require('../math/lcoE2')
import GeometricOperators = require('../math/GeometricOperators')
import mulE2 = require('../math/mulE2')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import mustBeString = require('../checks/mustBeString')
import MutableGeometricElement = require('../math/MutableGeometricElement')
import PseudoscalarEe = require('../math/PseudoE3')
import readOnly = require('../i18n/readOnly')
import rcoE2 = require('../math/rcoE2')
import scpE2 = require('../math/scpE2')
import SpinorE2 = require('../math/SpinorE2')
import stringFromCoordinates = require('../math/stringFromCoordinates')
import VectorE2 = require('../math/VectorE2')
import VectorN = require('../math/VectorN')
import wedgeXY = require('../math/wedgeXY')
import wedgeYZ = require('../math/wedgeYZ')
import wedgeZX = require('../math/wedgeZX')

// Symbolic constants for the coordinate indices into the data array.
let COORD_W = 0
let COORD_X = 1
let COORD_Y = 2
let COORD_XY = 3

let abs = Math.abs
let atan2 = Math.atan2
let exp = Math.exp
let cos = Math.cos
let sin = Math.sin

let BASIS_LABELS = ["1", "e1", "e2", "I"]
/**
 * Coordinates corresponding to basis labels.
 */
function coordinates(m: GeometricE2): number[] {
    return [m.w, m.x, m.y, m.xy]
}

/**
 * Promotes an unknown value to a G2, or returns undefined.
 */
function duckCopy(value: any): G2 {
    if (isObject(value)) {
        let m = <GeometricE2>value
        if (isNumber(m.x) && isNumber(m.y)) {
            if (isNumber(m.w) && isNumber(m.xy)) {
                console.warn("Copying GeometricE2 to G2")
                return G2.copy(m)
            }
            else {
                console.warn("Copying VectorE2 to G2")
                return G2.fromVector(m)
            }
        }
        else {
            if (isNumber(m.w) && isNumber(m.xy)) {
                console.warn("Copying SpinorE2 to G2")
                return G2.fromSpinor(m)
            }
            else {
                return void 0
            }
        }
    }
    else {
        return void 0
    }
}

function makeConstantE2(label: string, w: number, x: number, y: number, xy: number): GeometricE2 {
    mustBeString('label', label)
    mustBeNumber('w', w)
    mustBeNumber('x', x)
    mustBeNumber('y', y)
    mustBeNumber('xy', xy)
    var that: GeometricE2;
    that = {
        get w() {
            return w;
        },
        set w(unused: number) {
            throw new Error(readOnly(label + '.w').message);
        },
        get x() {
            return x;
        },
        set x(unused: number) {
            throw new Error(readOnly(label + '.x').message);
        },
        get y() {
            return y;
        },
        set y(unused: number) {
            throw new Error(readOnly(label + '.y').message);
        },
        get xy() {
            return xy;
        },
        set xy(unused: number) {
            throw new Error(readOnly(label + '.xy').message);
        },
        toString() {
            return label;
        }
    }
    return that
}

let zero = makeConstantE2('0', 0, 0, 0, 0);
let one = makeConstantE2('1', 1, 0, 0, 0);
let e1 = makeConstantE2('e1', 0, 1, 0, 0);
let e2 = makeConstantE2('e2', 0, 0, 1, 0);
let I = makeConstantE2('I', 0, 0, 0, 1);

/**
 * @class G2
 * @extends GeometricE2
 * @beta
 */
class G2 extends VectorN<number> implements GeometricE2, MutableGeometricElement<GeometricE2, G2, SpinorE2, VectorE2, GeometricE2>, GeometricOperators<G2> {
    /**
     * Constructs a <code>G2</code>.
     * The multivector is initialized to zero.
     * @class G2
     * @beta
     * @constructor
     */
    constructor() {
        super([0, 0, 0, 0], false, 4)
    }
    /**
     * The coordinate corresponding to the unit standard basis scalar.
     * @property w
     * @type {number}
     */
    get w(): number {
        return this.data[COORD_W]
    }
    set w(w: number) {
        mustBeNumber('w', w)
        this.modified = this.modified || this.data[COORD_W] !== w
        this.data[COORD_W] = w
    }
    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
     * @property x
     * @type {number}
     */
    get x(): number {
        return this.data[COORD_X]
    }
    set x(x: number) {
        mustBeNumber('x', x)
        this.modified = this.modified || this.data[COORD_X] !== x
        this.data[COORD_X] = x
    }
    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
     * @property y
     * @type {number}
     */
    get y(): number {
        return this.data[COORD_Y]
    }
    set y(y: number) {
        mustBeNumber('y', y)
        this.modified = this.modified || this.data[COORD_Y] !== y
        this.data[COORD_Y] = y
    }
    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     * @property xy
     * @type {number}
     */
    get xy(): number {
        return this.data[COORD_XY]
    }
    set xy(xy: number) {
        mustBeNumber('xy', xy)
        this.modified = this.modified || this.data[COORD_XY] !== xy
        this.data[COORD_XY] = xy
    }
    /**
     * <p>
     * <code>this ⟼ this + M * α</code>
     * </p>
     * @method add
     * @param M {GeometricE2}
     * @param α [number = 1]
     * @return {G2} <code>this</code>
     * @chainable
     */
    add(M: GeometricE2, α: number = 1): G2 {
        mustBeObject('M', M)
        mustBeNumber('α', α)
        this.w += M.w * α
        this.x += M.x * α
        this.y += M.y * α
        this.xy += M.xy * α
        return this
    }
    /**
     * <p>
     * <code>this ⟼ this + v * α</code>
     * </p>
     * @method addVector
     * @param v {VectorE2}
     * @param α [number = 1]
     * @return {G2} <code>this</code>
     * @chainable
     */
    addVector(v: VectorE2, α: number = 1): G2 {
        mustBeObject('v', v)
        mustBeNumber('α', α)
        this.x += v.x * α
        this.y += v.y * α
        return this
    }
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    add2(a: GeometricE2, b: GeometricE2): G2 {
        mustBeObject('a', a)
        mustBeObject('b', b)
        this.w = a.w + b.w
        this.x = a.x + b.x
        this.y = a.y + b.y
        this.xy = a.xy + b.xy
        return this
    }

    /**
     * Assuming <code>this = A * exp(B * θ)</code>, returns the <em>principal value</em> of θ.
     * @method arg
     * @return {number}
     */
    arg(): number {
        return atan2(this.xy, this.w)
    }

    /**
     * @method clone
     * @return {G2} <code>copy(this)</code>
     */
    clone(): G2 {
        let m = new G2()
        m.copy(this)
        return m
    }
    /**
     * <p>
     * <code>this ⟼ conjugate(this)</code>
     * </p>
     * @method conj
     * @return {G2} <code>this</code>
     * @chainable
     */
    conj(): G2 {
        // FIXME: This is only the bivector part.
        // Also need to think about various involutions.
        this.xy = -this.xy;
        return this
    }
    /**
     * <p>
     * <code>this ⟼ this << m</code>
     * </p>
     * @method lco
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    lco(m: GeometricE2): G2 {
        return this.conL2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ a << b</code>
     * </p>
     * @method conL2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    conL2(a: GeometricE2, b: GeometricE2): G2 {
        let a0 = a.w
        let a1 = a.x
        let a2 = a.y
        let a3 = a.xy
        let b0 = b.w
        let b1 = b.x
        let b2 = b.y
        let b3 = b.xy
        this.w = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0)
        this.x = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1)
        this.y = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2)
        this.xy = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3)
        return this
    }
    /**
     * <p>
     * <code>this ⟼ this >> m</code>
     * </p>
     * @method rco
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    rco(m: GeometricE2): G2 {
        return this.conR2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     * @method conR2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    conR2(a: GeometricE2, b: GeometricE2): G2 {
        let a0 = a.w
        let a1 = a.x
        let a2 = a.y
        let a3 = a.xy
        let b0 = b.w
        let b1 = b.x
        let b2 = b.y
        let b3 = b.xy
        this.w = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0)
        this.x = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1)
        this.y = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2)
        this.xy = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ copy(M)</code>
     * </p>
     * @method copy
     * @param M {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    copy(M: GeometricE2): G2 {
        mustBeObject('M', M)
        this.w = M.w
        this.x = M.x
        this.y = M.y
        this.xy = M.xy
        return this
    }

    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copySpinor
     * @param spinor {SpinorE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    copySpinor(spinor: SpinorE2) {
        mustBeObject('spinor', spinor)
        this.w = spinor.w
        this.x = 0
        this.y = 0
        this.xy = spinor.xy
        return this
    }

    /**
     * <p>
     * <code>this ⟼ copyVector(vector)</code>
     * </p>
     * @method copyVector
     * @param vector {VectorE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    copyVector(vector: VectorE2) {
        mustBeObject('vector', vector)
        this.w = 0
        this.x = vector.x
        this.y = vector.y
        this.xy = 0
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this / m</code>
     * </p>
     * @method div
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    div(m: GeometricE2): G2 {
        return this.div2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divideByScalar
     * @param α {number}
     * @return {G2} <code>this</code>
     * @chainable
     */
    divideByScalar(α: number): G2 {
        mustBeNumber('α', α)
        this.w /= α
        this.x /= α
        this.y /= α
        this.xy /= α
        return this
    }
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method div2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    div2(a: SpinorE2, b: SpinorE2): G2 {
        // FIXME: Generalize
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ dual(m) = I * m</code>
     * </p>
     * @method dual
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    dual(m: GeometricE2) {
        let w = -m.xy
        let x = +m.y
        let y = -m.x
        let xy = +m.w

        this.w = w
        this.x = x
        this.y = y
        this.xy = xy
        return this
    }
    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     * @method exp
     * @return {G2} <code>this</code>
     * @chainable
     */
    exp(): G2 {
        let w = this.w
        let z = this.xy
        let expW = exp(w)
        // φ is actually the absolute value of one half the rotation angle.
        // The orientation of the rotation gets carried in the bivector components.
        let φ = Math.sqrt(z * z)
        let s = expW * (φ !== 0 ? sin(φ) / φ : 1)
        this.w = expW * cos(φ);
        this.xy = z * s;
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {G2} <code>this</code>
     * @chainable
     */
    inv(): G2 {
        // FIXME: TODO
        this.conj()
        // this.divideByScalar(this.quaditude());
        return this
    }
    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {GeometricE2}
     * @param α {number}
     * @return {G2} <code>this</code>
     * @chainable
     */
    lerp(target: GeometricE2, α: number): G2 {
        mustBeObject('target', target)
        mustBeNumber('α', α)
        this.w += (target.w - this.w) * α;
        this.x += (target.x - this.x) * α;
        this.y += (target.y - this.y) * α;
        this.xy += (target.xy - this.xy) * α;
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @param α {number}
     * @return {G2} <code>this</code>
     * @chainable
     */
    lerp2(a: GeometricE2, b: GeometricE2, α: number): G2 {
        mustBeObject('a', a)
        mustBeObject('b', b)
        mustBeNumber('α', α)
        this.copy(a).lerp(b, α)
        return this
    }
    /**
     * <p>
     * <code>this ⟼ log(sqrt(w * w + xy * xy)) + <b>e</b><sub>1</sub><b>e</b><sub>2</sub> * atan2(xy, w)</code>
     * </p>
     * @method log
     * @return {G2} <code>this</code>
     * @chainable
     */
    log() {
        // FIXME: This only handles the spinor components.
        let w = this.w
        let xy = this.xy
        let r = Math.sqrt(w * w + xy * xy)
        this.w = Math.log(r)
        this.x = 0
        this.y = 0
        this.xy = Math.atan2(xy, w)
        return this;
    }

    /**
     * @method magnitude
     * @return {number} 
     */
    magnitude(): number {
        return Math.sqrt(this.quaditude());
    }

    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @method mul
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    mul(m: GeometricE2): G2 {
        return this.mul2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method mul2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    mul2(a: GeometricE2, b: GeometricE2) {
        let a0 = a.w
        let a1 = a.x
        let a2 = a.y
        let a3 = a.xy
        let b0 = b.w
        let b1 = b.x
        let b2 = b.y
        let b3 = b.xy
        this.w = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0)
        this.x = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1)
        this.y = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2)
        this.xy = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3)
        return this
    }
    /**
     * <p>
     * <code>this ⟼ -1 * this</code>
     * </p>
     * @method neg
     * @return {G2} <code>this</code>
     * @chainable
     */
    neg() {
        this.w = -this.w
        this.x = -this.x
        this.y = -this.y
        this.xy = -this.xy
        return this;
    }

    /**
    * <p>
    * <code>this ⟼ sqrt(this * conj(this))</code>
    * </p>
    * @method norm
    * @return {G2} <code>this</code>
    * @chainable
    */
    norm(): G2 {
        this.w = this.magnitude()
        this.x = 0
        this.y = 0
        this.xy = 0
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method normalize
     * @return {G2} <code>this</code>
     * @chainable
     */
    normalize(): G2 {
        // The quaditude is the squared norm.
        let norm = Math.sqrt(this.quaditude())
        this.w = this.w / norm
        this.x = this.x / norm
        this.y = this.y / norm
        this.xy = this.xy / norm
        return this
    }

    /**
     * <p>
     * Updates <code>this</code> target to be the <em>quad</em> or <em>squared norm</em> of the target.
     * </p>
     * <p>
     * <code>this ⟼ scp(this, rev(this)) = this | ~this</code>
     * </p>
     * @method quad
     * @return {G2} <code>this</code>
     * @chainable
     */
    quad(): G2 {
        this.w = this.quaditude()
        this.x = 0
        this.y = 0
        this.xy = 0
        return this
    }

    /**
     * Computes the <em>squared norm</em> of this <code>G2</code> multivector. 
     * @method quaditude
     * @return {number} <code>this | ~this</code>
     */
    quaditude(): number {
        let w = this.w
        let x = this.x
        let y = this.y
        let B = this.xy
        return w * w + x * x + y * y + B * B
    }
    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     * @method reflect
     * @param n {VectorE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE2): G2 {
        // FIXME: This inly reflects the vector components.
        mustBeObject('n', n);
        let x = this.x;
        let y = this.y;
        let nx = n.x;
        let ny = n.y;
        let dot2 = (x * nx + y * ny) * 2;
        this.x = x - dot2 * nx;
        this.y = y - dot2 * ny;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ reverse(this)</code>
     * </p>
     * @method reverse
     * @return {G2} <code>this</code>
     * @chainable
     */
    reverse(): G2 {
        // reverse has a ++-- structure.
        this.w = this.w
        this.x = this.x
        this.y = this.y
        this.xy = -this.xy
        return this
    }
    /**
     * @method __tilde__
     * @return {G2}
     */
    __tilde__(): G2 {
        return G2.copy(this).reverse()
    }
    /**
     * <p>
     * <code>this ⟼ R * this * reverse(R)</code>
     * </p>
     * @method rotate
     * @param R {SpinorE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    rotate(R: SpinorE2): G2 {
        mustBeObject('R', R);
        // FIXME: This only rotates the vector components.
        let x = this.x;
        let y = this.y;

        let a = R.xy;
        let w = R.w;

        let ix = w * x + a * y;
        let iy = w * y - a * x;

        this.x = ix * w + iy * a;
        this.y = iy * w - ix * a;

        return this;
    }
    /**
     * <p>
     * Computes a rotor, R, from two unit vectors, where
     * R = (1 + b * a) / sqrt(2 * (1 + b << a))
     * </p>
     * @method rotor
     * @param b {VectorE2} The ending unit vector
     * @param a {VectorE2} The starting unit vector
     * @return {G2} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotor(b: VectorE2, a: VectorE2): G2 {
        this.spinor(b, a)
        this.w += 1 // FIXME: addScalar would make this all chainable
        return this.divideByScalar(Math.sqrt(2 * (1 + dotVectorsE2(b, a))))
    }
    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     * @method rotorFromGeneratorAngle
     * @param B {SpinorE2}
     * @param θ {number}
     * @return {G2} <code>this</code>
     */
    rotorFromGeneratorAngle(B: SpinorE2, θ: number) {
        mustBeObject('B', B)
        mustBeNumber('θ', θ)
        // We assume that B really is just a bivector
        // by ignoring scalar and vector components.
        // Normally, B will have unit magnitude and B * B => -1.
        // However, we don't assume that is the case.
        // The effect will be a scaling of the angle.
        // A non unitary rotor, on the other hand, will scale the transformation.
        // We must also take into account the orientation of B.
        let xy = B.xy
        /**
         * Sandwich operation means we need the half-angle.
         */
        let φ = θ / 2
        /**
         * scalar part = cos(|B| * θ / 2)
         */
        this.w = cos(abs(xy) * φ)
        this.x = 0
        this.y = 0
        /**
         * pseudo part = -unit(B) * sin(|B| * θ / 2)
         */
        this.xy = -sin(xy * φ)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ align(this, m)</code>
     * </p>
     * @method align
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    align(m: GeometricE2): G2 {
        return this.align2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ align(a, b)</code>
     * </p>
     * @method align2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    align2(a: GeometricE2, b: GeometricE2) {
        this.w = scpE2(a.w, a.x, a.y, a.xy, b.w, b.x, b.y, b.xy, 0)
        this.x = 0
        this.y = 0
        this.xy = 0
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number} 
     */
    scale(α: number): G2 {
        mustBeNumber('α', α)
        this.w *= α
        this.x *= α
        this.y *= α
        this.xy *= α
        return this
    }
    /**
     * <p>
     * <code>this ⟼ a * b = a · b + a ^ b</code>
     * </p>
     * Sets this G2 to the geometric product a * b of the vector arguments. 
     * @method spinor
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @return {G2} <code>this</code>
     */
    spinor(a: VectorE2, b: VectorE2) {
        let ax = a.x
        let ay = a.y
        let bx = b.x
        let by = b.y

        this.w = dotVectorsE2(a, b)
        this.x = 0
        this.y = 0
        this.xy = wedgeXY(ax, ay, 0, bx, by, 0) // FIXME wedgeVectorsE2

        return this
    }
    /**
     * <p>
     * <code>this ⟼ this - M * α</code>
     * </p>
     * @method sub
     * @param M {GeometricE2}
     * @param α [number = 1]
     * @return {G2} <code>this</code>
     * @chainable
     */
    sub(M: GeometricE2, α: number = 1): G2 {
        mustBeObject('M', M)
        mustBeNumber('α', α)
        this.w -= M.w * α
        this.x -= M.x * α
        this.y -= M.y * α
        this.xy -= M.xy * α
        return this
    }
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    sub2(a: GeometricE2, b: GeometricE2): G2 {
        mustBeObject('a', a)
        mustBeObject('b', b)
        this.w = a.w - b.w
        this.x = a.x - b.x
        this.y = a.y - b.y
        this.xy = a.xy - b.xy
        return this
    }

    /**
     * Returns a string representing the number in fixed-point notation.
     * @method toFixed
     * @param fractionDigits [number]
     * @return {string}
     */
    toFixed(fractionDigits?: number): string {
        var coordToString = function(coord: number): string { return coord.toFixed(fractionDigits) };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS)
    }

    /**
     * Returns a string representation of the number.
     * @method toString
     * @return {string} 
     */
    toString(): string {
        let coordToString = function(coord: number): string { return coord.toString() };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS)
    }

    /**
     * <p>
     * <code>this ⟼ this ^ m</code>
     * </p>
     * @method wedge
     * @param m {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    wedge(m: GeometricE2): G2 {
        return this.wedge2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     * @method wedge2
     * @param a {GeometricE2}
     * @param b {GeometricE2}
     * @return {G2} <code>this</code>
     * @chainable
     */
    wedge2(a: GeometricE2, b: GeometricE2): G2 {
        let a0 = a.w
        let a1 = a.x
        let a2 = a.y
        let a3 = a.xy
        let b0 = b.w
        let b1 = b.x
        let b2 = b.y
        let b3 = b.xy
        this.w = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0)
        this.x = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1)
        this.y = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2)
        this.xy = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3)
        return this
    }

    /**
     * @method __add__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __add__(other: any) {
        if (other instanceof G2) {
            return G2.copy(this).add(other)
        }
        else if (typeof other === 'number') {
            return G2.fromScalar(other).add(this)
        }
        else {
            let rhs = duckCopy(other)
            if (rhs) {
                // rhs is a copy and addition commutes.
                return rhs.add(this)
            }
            else {
                return void 0
            }
        }
    }

    /**
     * @method __div__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __div__(other: any) {
        if (other instanceof G2) {
            return G2.copy(this).div(other)
        }
        else if (typeof other === 'number') {
            return G2.copy(this).divideByScalar(other)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __mul__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __mul__(other: any): G2 {
        if (other instanceof G2) {
            return G2.copy(this).mul(other)
        }
        else if (typeof other === 'number') {
            return G2.copy(this).scale(other)
        }
        else {
            let rhs = duckCopy(other)
            if (rhs) {
                // rhs is a copy but multiplication does not commute.
                // If we had rmul then we could mutate the rhs!
                return this.__mul__(rhs);
            }
            else {
                return void 0
            }
        }
    }

    /**
     * @method __rmul__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __rmul__(other: any) {
        if (other instanceof G2) {
            return G2.copy(other).mul(this)
        }
        else if (typeof other === 'number') {
            // Scalar multiplication commutes.
            return G2.copy(this).scale(other)
        }
        else {
            let lhs = duckCopy(other)
            if (lhs) {
                // lhs is a copy, so we can mutate it.
                return lhs.mul(this)
            }
            else {
                return void 0
            }
        }
    }

    /**
     * @method __radd__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __radd__(other: any) {
        if (other instanceof G2) {
            var rhs = <G2>other
            return G2.copy(other).add(this)
        }
        else if (typeof other === 'number') {
            return G2.fromScalar(other).add(this)
        }
        else {
            let lhs = duckCopy(other)
            if (lhs) {
                // lhs is a copy, so we can mutate it.
                return lhs.add(this)
            }
            else {
                return void 0
            }
        }
    }
    /**
     * @method __sub__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __sub__(other: any) {
        if (other instanceof G2) {
            var rhs = <G2>other
            return G2.copy(this).sub(rhs)
        }
        else if (typeof other === 'number') {
            return G2.fromScalar(-other).add(this)
        }
        else {
            return void 0
        }
    }
    /**
     * @method __rsub__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __rsub__(other: any) {
        if (other instanceof G2) {
            var rhs = <G2>other
            return G2.copy(other).sub(this)
        }
        else if (typeof other === 'number') {
            return G2.fromScalar(other).sub(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __wedge__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __wedge__(other: any) {
        if (other instanceof G2) {
            return G2.copy(this).wedge(other)
        }
        else if (typeof other === 'number') {
            // The outer product with a scalar is simply scalar multiplication.
            return G2.copy(this).scale(other)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rwedge__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __rwedge__(other: any) {
        if (other instanceof G2) {
            return G2.copy(other).wedge(this)
        }
        else if (typeof other === 'number') {
            // The outer product with a scalar is simply scalar multiplication, and commutes
            return G2.copy(this).scale(other)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __lshift__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __lshift__(other: any) {
        if (other instanceof G2) {
            return G2.copy(this).lco(other)
        }
        else if (typeof other === 'number') {
            return G2.fromScalar(other).lco(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rshift__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __rshift__(other: any) {
        if (other instanceof G2) {
            return G2.copy(this).rco(other)
        }
        else if (typeof other === 'number') {
            return G2.fromScalar(other).rco(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __vbar__
     * @param other {any}
     * @return {G2}
     * @private
     */
    __vbar__(other: any) {
        if (other instanceof G2) {
            return G2.copy(this).align(other)
        }
        else if (typeof other === 'number') {
            return G2.fromScalar(other).align(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __pos__
     * @return {G2}
     * @private
     * @chainable
     */
    __pos__() {
        // It's important that we make a copy whenever using operators.
        return G2.copy(this)/*.pos()*/
    }

    /**
     * @method __neg__
     * @return {G2}
     * @private
     * @chainable
     */
    __neg__() {
        return G2.copy(this).neg()
    }

    /**
     * The identity element for addition.
     * @property zero
     * @type {G2}
     * @readOnly
     * @static
     */
    static get zero(): G2 { return G2.copy(zero); };

    /**
     * The identity element for multiplication.
     * @property one
     * @type {G2}
     * @readOnly
     * @static
     */
    static get one(): G2 { return G2.copy(one); };

    /**
     * Basis vector corresponding to the <code>x</code> coordinate.
     * @property e1
     * @type {G2}
     * @readOnly
     * @static
     */
    static get e1(): G2 { return G2.copy(e1); };

    /**
     * Basis vector corresponding to the <code>y</code> coordinate.
     * @property e2
     * @type {G2}
     * @readOnly
     * @static
     */
    static get e2(): G2 { return G2.copy(e2); };

    /**
     * Basis vector corresponding to the <code>xy</code> coordinate.
     * @property I
     * @type {G2}
     * @readOnly
     * @static
     */
    static get I(): G2 { return G2.copy(I); };

    /**
     * @method copy
     * @param M {GeometricE2}
     * @return {G2}
     * @static
     */
    static copy(M: GeometricE2): G2 {
        var copy = new G2()
        copy.w = M.w
        copy.x = M.x
        copy.y = M.y
        copy.xy = M.xy
        return copy
    }

    /**
     * @method fromScalar
     * @param α {number}
     * @return {G2}
     * @static
     * @chainable
     */
    static fromScalar(α: number): G2 {
        var copy = new G2()
        copy.w = α
        return copy
    }

    /**
     * @method fromSpinor
     * @param spinor {SpinorE2}
     * @return {G2}
     * @static
     */
    static fromSpinor(spinor: SpinorE2): G2 {
        var copy = new G2()
        copy.w = spinor.w
        copy.x = 0
        copy.y = 0
        copy.xy = spinor.xy
        return copy
    }

    /**
     * @method fromVector
     * @param vector {VectorE2}
     * @return {G2}
     * @static
     */
    static fromVector(vector: VectorE2): G2 {
        var copy = new G2()
        copy.w = 0
        copy.x = vector.x
        copy.y = vector.y
        copy.xy = 0
        return copy
    }
    /**
    * @method lerp
    * @param A {GeometricE2}
    * @param B {GeometricE2}
    * @param α {number}
    * @return {G2} <code>A + α * (B - A)</code>
    * @static
    */
    static lerp(A: GeometricE2, B: GeometricE2, α: number): G2 {
        return G2.copy(A).lerp(B, α)
        // return G2.copy(B).sub(A).scale(α).add(A)
    }

}

export = G2