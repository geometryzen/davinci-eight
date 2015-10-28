import dotVectorCartesianE3 = require('../math/dotVectorCartesianE3')
import dotVector = require('../math/dotVectorE3')
import extG3 = require('../math/extG3')
import GeometricE3 = require('../math/GeometricE3')
import isNumber = require('../checks/isNumber')
import lcoG3 = require('../math/lcoG3')
import GeometricOperators = require('../math/GeometricOperators')
import mulG3 = require('../math/mulG3')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import MutableGeometricElement3D = require('../math/MutableGeometricElement3D')
import PseudoscalarEe = require('../math/PseudoE3')
import quadVector = require('../math/quadVectorE3')
import rcoG3 = require('../math/rcoG3')
import rotorFromDirections = require('../math/rotorFromDirections')
import scpG3 = require('../math/scpG3')
import SpinorE3 = require('../math/SpinorE3')
import stringFromCoordinates = require('../math/stringFromCoordinates')
import VectorE3 = require('../math/VectorE3')
import VectorN = require('../math/VectorN')
import wedgeXY = require('../math/wedgeXY')
import wedgeYZ = require('../math/wedgeYZ')
import wedgeZX = require('../math/wedgeZX')

// Symbolic constants for the coordinate indices into the data array.
let COORD_W = 0
let COORD_X = 1
let COORD_Y = 2
let COORD_Z = 3
let COORD_XY = 4
let COORD_YZ = 5
let COORD_ZX = 6
let COORD_XYZ = 7

let exp = Math.exp
let cos = Math.cos
let sin = Math.sin

let BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"]
/**
 * Coordinates corresponding to basis labels.
 */
function coordinates(m: GeometricE3): number[] {
    return [m.w, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.xyz]
}

/**
 * @class G3
 * @extends GeometricE3
 * @beta
 */
class G3 extends VectorN<number> implements GeometricE3, MutableGeometricElement3D<GeometricE3, G3, SpinorE3, VectorE3>, GeometricOperators<G3> {
    /**
     * Constructs a <code>G3</code>.
     * The multivector is initialized to zero.
     * @class G3
     * @beta
     * @constructor
     */
    constructor() {
        super([0, 0, 0, 0, 0, 0, 0, 0], false, 8)
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
     * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
     * @property z
     * @type {number}
     */
    get z(): number {
        return this.data[COORD_Z]
    }
    set z(z: number) {
        mustBeNumber('z', z)
        this.modified = this.modified || this.data[COORD_Z] !== z
        this.data[COORD_Z] = z
    }
    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
     * @property yz
     * @type {number}
     */
    get yz(): number {
        return this.data[COORD_YZ]
    }
    set yz(yz: number) {
        mustBeNumber('yz', yz)
        this.modified = this.modified || this.data[COORD_YZ] !== yz
        this.data[COORD_YZ] = yz
    }
    /**
     * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
     * @property zx
     * @type {number}
     */
    get zx(): number {
        return this.data[COORD_ZX]
    }
    set zx(zx: number) {
        mustBeNumber('zx', zx)
        this.modified = this.modified || this.data[COORD_ZX] !== zx
        this.data[COORD_ZX] = zx
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
     * The coordinate corresponding to the I<sub>3</sub> <code>=</code> <b>e</b><sub>1</sub><b>e</b><sub>2</sub><b>e</b><sub>2</sub> standard basis pseudoscalar.
     * @property xyz
     * @type {number}
     */
    get xyz(): number {
        return this.data[COORD_XYZ]
    }
    set xyz(xyz: number) {
        mustBeNumber('xyz', xyz)
        this.modified = this.modified || this.data[COORD_XYZ] !== xyz
        this.data[COORD_XYZ] = xyz
    }

    /**
     * <p>
     * <code>this ⟼ this + M * α</code>
     * </p>
     * @method add
     * @param M {GeometricE3}
     * @param α [number = 1]
     * @return {G3} <code>this</code>
     * @chainable
     */
    add(M: GeometricE3, α: number = 1): G3 {
        mustBeObject('M', M)
        mustBeNumber('α', α)
        this.w += M.w * α
        this.x += M.x * α
        this.y += M.y * α
        this.z += M.z * α
        this.yz += M.yz * α
        this.zx += M.zx * α
        this.xy += M.xy * α
        this.xyz += M.xyz * α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this + α</code>
     * </p>
     * @method addScalar
     * @param α {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    addScalar(α: number): G3 {
        mustBeNumber('α', α)
        this.w += α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this + v * α</code>
     * </p>
     * @method addVector
     * @param v {VectorE3}
     * @param α [number = 1]
     * @return {G3} <code>this</code>
     * @chainable
     */
    addVector(v: VectorE3, α: number = 1): G3 {
        mustBeObject('v', v)
        mustBeNumber('α', α)
        this.x += v.x * α
        this.y += v.y * α
        this.z += v.z * α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    add2(a: GeometricE3, b: GeometricE3): G3 {
        mustBeObject('a', a)
        mustBeObject('b', b)
        this.w = a.w + b.w
        this.x = a.x + b.x
        this.y = a.y + b.y
        this.z = a.z + b.z
        this.yz = a.yz + b.yz
        this.zx = a.zx + b.zx
        this.xy = a.xy + b.xy
        this.xyz = a.xyz + b.xyz
        return this
    }

    adj(): G3 {
        throw new Error('TODO: G3.adj')
    }

    /**
     * @method arg
     * @return {number}
     */
    arg(): number {
        throw new Error('TODO: G3.arg')
    }

    /**
     * @method clone
     * @return {G3} <code>copy(this)</code>
     * @chainable
     */
    clone(): G3 {
        return G3.copy(this)
    }

    /**
     * <p>
     * <code>this ⟼ conjugate(this)</code>
     * </p>
     * @method conj
     * @return {G3} <code>this</code>
     * @chainable
     */
    conj(): G3 {
        // FIXME: This is only the bivector part.
        // Also need to think about various involutions.
        this.yz = -this.yz;
        this.zx = -this.zx;
        this.xy = -this.xy;
        return this
    }
    /**
     * <p>
     * <code>this ⟼ this << m</code>
     * </p>
     * @method lco
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    lco(m: GeometricE3): G3 {
        return this.lco2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ a << b</code>
     * </p>
     * @method lco2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    lco2(a: GeometricE3, b: GeometricE3): G3 {
        return lcoG3(a, b, this)
    }
    /**
     * <p>
     * <code>this ⟼ this >> m</code>
     * </p>
     * @method rco
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    rco(m: GeometricE3): G3 {
        return this.rco2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     * @method rco2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    rco2(a: GeometricE3, b: GeometricE3): G3 {
        return rcoG3(a, b, this)
    }

    /**
     * <p>
     * <code>this ⟼ copy(v)</code>
     * </p>
     * @method copy
     * @param M {VectorE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    copy(M: GeometricE3): G3 {
        mustBeObject('M', M)
        this.w = M.w
        this.x = M.x
        this.y = M.y
        this.z = M.z
        this.yz = M.yz
        this.zx = M.zx
        this.xy = M.xy
        this.xyz = M.xyz
        return this
    }

    /**
     * <p>
     * <code>this ⟼ copy(spinor)</code>
     * </p>
     * @method copySpinor
     * @param spinor {SpinorE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    copySpinor(spinor: SpinorE3) {
        mustBeObject('spinor', spinor)
        this.w = spinor.w
        this.x = 0
        this.y = 0
        this.z = 0
        this.yz = spinor.yz
        this.zx = spinor.zx
        this.xy = spinor.xy
        this.xyz = 0
        return this
    }

    /**
     * <p>
     * <code>this ⟼ copyVector(vector)</code>
     * </p>
     * @method copyVector
     * @param vector {VectorE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    copyVector(vector: VectorE3) {
        mustBeObject('vector', vector)
        this.w = 0
        this.x = vector.x
        this.y = vector.y
        this.z = vector.z
        this.yz = 0
        this.zx = 0
        this.xy = 0
        this.xyz = 0
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this / m</code>
     * </p>
     * @method div
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    div(m: GeometricE3): G3 {
        return this.div2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divByScalar
     * @param α {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    divByScalar(α: number): G3 {
        mustBeNumber('α', α)
        this.w /= α
        this.x /= α
        this.y /= α
        this.z /= α
        this.yz /= α
        this.zx /= α
        this.xy /= α
        this.xyz /= α
        return this
    }
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     * @method div2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    div2(a: SpinorE3, b: SpinorE3): G3 {
        // FIXME: Generalize
        let a0 = a.w;
        let a1 = a.yz;
        let a2 = a.zx;
        let a3 = a.xy;
        let b0 = b.w;
        let b1 = b.yz;
        let b2 = b.zx;
        let b3 = b.xy;
        // Compare this to the product for Quaternions
        // It would be interesting to DRY this out.
        this.w = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
        // this.w = a0 * b0 - dotVectorCartesianE3(a1, a2, a3, b1, b2, b3)
        this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
        this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
        this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ dual(m) = I * m</code>
     * </p>
     * @method dual
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    dual(m: GeometricE3) {
        let w = -m.xyz
        let x = -m.yz
        let y = -m.zx
        let z = -m.xy
        let yz = m.x
        let zx = m.y
        let xy = m.z
        let xyz = m.w

        this.w = w
        this.x = x
        this.y = y
        this.z = z
        this.yz = yz
        this.zx = zx
        this.xy = xy
        this.xyz = xyz

        return this
    }
    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     * @method exp
     * @return {G3} <code>this</code>
     * @chainable
     */
    exp(): G3 {
        let w = this.w
        let x = this.yz
        let y = this.zx
        let z = this.xy
        let expW = exp(w)
        // φ is actually the absolute value of one half the rotation angle.
        // The orientation of the rotation gets carried in the bivector components.
        let φ = Math.sqrt(x * x + y * y + z * z)
        let s = expW * (φ !== 0 ? sin(φ) / φ : 1)
        this.w = expW * cos(φ);
        this.yz = x * s;
        this.zx = y * s;
        this.xy = z * s;
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ conj(this) / quad(this)</code>
     * </p>
     * @method inv
     * @return {G3} <code>this</code>
     * @chainable
     */
    inv(): G3 {
        // FIXME: TODO
        this.conj()
        // this.divByScalar(this.quaditude());
        return this
    }

    /**
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean {
        return this.w === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.xyz === 0
    }

    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean {
        return this.w === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.xyz === 0
    }

    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {GeometricE3}
     * @param α {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    lerp(target: GeometricE3, α: number): G3 {
        mustBeObject('target', target)
        mustBeNumber('α', α)
        this.w += (target.w - this.w) * α;
        this.x += (target.x - this.x) * α;
        this.y += (target.y - this.y) * α;
        this.z += (target.z - this.z) * α;
        this.yz += (target.yz - this.yz) * α;
        this.zx += (target.zx - this.zx) * α;
        this.xy += (target.xy - this.xy) * α;
        this.xyz += (target.xyz - this.xyz) * α;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @param α {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    lerp2(a: GeometricE3, b: GeometricE3, α: number): G3 {
        mustBeObject('a', a)
        mustBeObject('b', b)
        mustBeNumber('α', α)
        this.copy(a).lerp(b, α)
        return this
    }
    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     * @method log
     * @return {G3} <code>this</code>
     * @chainable
     */
    log(): G3 {
        // FIXME: TODO
        let w = this.w
        let x = this.yz
        let y = this.zx
        let z = this.xy
        let bb = x * x + y * y + z * z
        let R2 = Math.sqrt(bb)
        let R0 = Math.abs(w)
        let R = Math.sqrt(w * w + bb)
        this.w = Math.log(R)
        let f = Math.atan2(R2, R0) / R2
        this.yz = x * f
        this.zx = y * f
        this.xy = z * f
        return this;
    }
    magnitude() {
        return Math.sqrt(this.quaditude());
    }

    /**
     * <p>
     * <code>this ⟼ this * s</code>
     * </p>
     * @method mul
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    mul(m: GeometricE3): G3 {
        return this.mul2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * @method mul2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    mul2(a: GeometricE3, b: GeometricE3): G3 {
        return mulG3(a, b, this)
    }
    /**
     * <p>
     * <code>this ⟼ -1 * this</code>
     * </p>
     * @method neg
     * @return {G3} <code>this</code>
     * @chainable
     */
    neg() {
        this.w = -this.w
        this.x = -this.x
        this.y = -this.y
        this.z = -this.z
        this.yz = this.yz
        this.zx = -this.zx
        this.xy = -this.xy
        this.xyz = -this.xyz
        return this;
    }

    /**
    * <p>
    * <code>this ⟼ sqrt(this * conj(this))</code>
    * </p>
    * @method norm
    * @return {G3} <code>this</code>
    * @chainable
    */
    norm(): G3 {
        // FIXME: TODO
        this.w = this.magnitude()
        this.yz = 0
        this.zx = 0
        this.xy = 0
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this / magnitude(this)</code>
     * </p>
     * @method normalize
     * @return {G3} <code>this</code>
     * @chainable
     */
    normalize(): G3 {
        // The quaditude is the squared norm.
        let norm = Math.sqrt(this.quaditude())
        this.w = this.w / norm
        this.x = this.x / norm
        this.y = this.y / norm
        this.z = this.z / norm
        this.yz = this.yz / norm
        this.zx = this.zx / norm
        this.xy = this.xy / norm
        this.xyz = this.xyz / norm
        return this
    }

    /**
    * <p>
    * <code>this ⟼ scp(this, rev(this)) = this | ~this</code>
    * </p>
    * @method quad
    * @return {G3} <code>this</code>
    * @chainable
    */
    quad(): G3 {
        // FIXME: TODO
        this.w = this.quaditude()
        this.yz = 0
        this.zx = 0
        this.xy = 0
        return this
    }

    /**
     * @method quaditude
     * @return {number} <code>this * conj(this)</code>
     */
    quaditude(): number {
        // FIXME: TODO
        let w = this.w;
        let yz = this.yz;
        let zx = this.zx;
        let xy = this.xy;
        return w * w + yz * yz + zx * zx + xy * xy;
    }
    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     * @method reflect
     * @param n {VectorE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3): G3 {
        // FIXME: This inly reflects the vector components.
        mustBeObject('n', n);
        let x = this.x;
        let y = this.y;
        let z = this.z;
        let nx = n.x;
        let ny = n.y;
        let nz = n.z;
        let dot2 = (x * nx + y * ny + z * nz) * 2;
        this.x = x - dot2 * nx;
        this.y = y - dot2 * ny;
        this.z = z - dot2 * nz;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ rev(this)</code>
     * </p>
     * @method reverse
     * @return {G3} <code>this</code>
     * @chainable
     */
    rev(): G3 {
        // reverse has a ++-- structure.
        this.w = this.w
        this.x = this.x
        this.y = this.y
        this.z = this.z
        this.yz = -this.yz
        this.zx = -this.zx
        this.xy = -this.xy
        this.xyz = -this.xyz
        return this
    }
    /**
     * @method __tilde__
     * @return {G3}
     */
    __tilde__(): G3 {
        return G3.copy(this).rev()
    }
    /**
     * <p>
     * <code>this ⟼ R * this * rev(R)</code>
     * </p>
     * @method rotate
     * @param R {SpinorE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    rotate(R: SpinorE3): G3 {
        mustBeObject('R', R);
        // FIXME: This only rotates the vector components.
        let x = this.x;
        let y = this.y;
        let z = this.z;

        let a = R.xy;
        let b = R.yz;
        let c = R.zx;
        let w = R.w;

        let ix = w * x - c * z + a * y;
        let iy = w * y - a * x + b * z;
        let iz = w * z - b * y + c * x;
        let iw = b * x + c * y + a * z;

        this.x = ix * w + iw * b + iy * a - iz * c;
        this.y = iy * w + iw * c + iz * b - ix * a;
        this.z = iz * w + iw * a + ix * c - iy * b;

        return this;
    }
    /**
     * <p>
     * Computes a rotor, R, from two unit vectors, where
     * R = (1 + b * a) / sqrt(2 * (1 + b << a))
     * </p>
     * @method rotorFromDirections
     * @param b {VectorE3} The ending unit vector
     * @param a {VectorE3} The starting unit vector
     * @return {G3} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotorFromDirections(b: VectorE3, a: VectorE3): G3 {
        return rotorFromDirections(a, b, quadVector, dotVector, this)
    }

    /**
     * <p>
     * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
     * </p>
     * @method rotorFromAxisAngle
     * @param axis {VectorE3}
     * @param θ {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): G3 {
        // FIXME: TODO
        let φ = θ / 2
        let s = sin(φ)
        this.yz = -axis.x * s
        this.zx = -axis.y * s
        this.xy = -axis.z * s
        this.w = cos(φ)
        return this
    }

    /**
     * <p>
     * <code>this = ⟼ exp(- B * θ / 2)</code>
     * </p>
     * @method rotorFromGeneratorAngle
     * @param B {SpinorE3}
     * @param θ {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    rotorFromGeneratorAngle(B: SpinorE3, θ: number): G3 {
        // FIXME: TODO
        let φ = θ / 2
        let s = sin(φ)
        this.yz = -B.yz * s
        this.zx = -B.zx * s
        this.xy = -B.xy * s
        this.w = cos(φ)
        return this
    }

    /**
     * <p>
     * <code>this ⟼ scp(this, m)</code>
     * </p>
     * @method align
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    scp(m: GeometricE3): G3 {
        return this.scp2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ scp(a, b)</code>
     * </p>
     * @method scp2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    scp2(a: GeometricE3, b: GeometricE3): G3 {
        return scpG3(a, b, this)
    }

    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number} 
     */
    scale(α: number): G3 {
        mustBeNumber('α', α)
        this.w *= α
        this.x *= α
        this.y *= α
        this.z *= α
        this.yz *= α
        this.zx *= α
        this.xy *= α
        this.xyz *= α
        return this
    }

    slerp(target: GeometricE3, α: number): G3 {
        mustBeObject('target', target)
        mustBeNumber('α', α)
        // TODO
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this G3 to the geometric product a * b of the vector arguments. 
     * @method spinor
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {G3} <code>this</code>
     */
    spinor(a: VectorE3, b: VectorE3): G3 {
        let ax = a.x;
        let ay = a.y;
        let az = a.z;
        let bx = b.x;
        let by = b.y;
        let bz = b.z;

        this.w = 0
        this.addScalar(dotVector(a, b))
        this.x = 0
        this.y = 0
        this.z = 0
        this.yz = wedgeYZ(ax, ay, az, bx, by, bz)
        this.zx = wedgeZX(ax, ay, az, bx, by, bz)
        this.xy = wedgeXY(ax, ay, az, bx, by, bz)
        this.xyz = 0

        return this
    }
    /**
     * <p>
     * <code>this ⟼ this - M * α</code>
     * </p>
     * @method sub
     * @param M {GeometricE3}
     * @param α [number = 1]
     * @return {G3} <code>this</code>
     * @chainable
     */
    sub(M: GeometricE3, α: number = 1): G3 {
        mustBeObject('M', M)
        mustBeNumber('α', α)
        this.w -= M.w * α
        this.x -= M.x * α
        this.y -= M.y * α
        this.z -= M.z * α
        this.yz -= M.yz * α
        this.zx -= M.zx * α
        this.xy -= M.xy * α
        this.xyz -= M.xyz * α
        return this
    }
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    sub2(a: GeometricE3, b: GeometricE3): G3 {
        mustBeObject('a', a)
        mustBeObject('b', b)
        this.w = a.w - b.w
        this.x = a.x - b.x
        this.y = a.y - b.y
        this.z = a.z - b.z
        this.yz = a.yz - b.yz
        this.zx = a.zx - b.zx
        this.xy = a.xy - b.xy
        this.xyz = a.xyz - b.xyz
        return this
    }

    /**
     * Returns a string representing the number in exponential notation.
     * @method toExponential
     * @return {string}
     */
    toExponential(): string {
        var coordToString = function(coord: number): string { return coord.toExponential() };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS)
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
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    ext(m: GeometricE3): G3 {
        return this.ext2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     * @method ext2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    ext2(a: GeometricE3, b: GeometricE3): G3 {
        return extG3(a, b, this)
    }

    /**
     * @method __add__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __add__(rhs: any) {
        if (rhs instanceof G3) {
            return G3.copy(this).add(rhs)
        }
        else if (typeof rhs === 'number') {
            return G3.copy(this).add(G3.fromScalar(rhs))
        }
        else {
            return void 0
        }
    }

    /**
     * @method __div__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __div__(rhs: any) {
        if (rhs instanceof G3) {
            return G3.copy(this).div(rhs)
        }
        else if (typeof rhs === 'number') {
            return G3.copy(this).divByScalar(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rdiv__
     * @param lhs {any}
     * @return {G3}
     * @private
     */
    __rdiv__(lhs: any) {
        if (lhs instanceof G3) {
            return G3.copy(lhs).div(this)
        }
        else if (typeof lhs === 'number') {
            return G3.fromScalar(lhs).div(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __mul__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __mul__(rhs: any) {
        if (rhs instanceof G3) {
            return G3.copy(this).mul(rhs)
        }
        else if (typeof rhs === 'number') {
            return G3.copy(this).scale(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rmul__
     * @param lhs {any}
     * @return {G3}
     * @private
     */
    __rmul__(lhs: any) {
        if (lhs instanceof G3) {
            return G3.copy(lhs).mul(this)
        }
        else if (typeof lhs === 'number') {
            // Scalar multiplication commutes.
            return G3.copy(this).scale(lhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __radd__
     * @param lhs {any}
     * @return {G3}
     * @private
     */
    __radd__(lhs: any) {
        if (lhs instanceof G3) {
            return G3.copy(lhs).add(this)
        }
        else if (typeof lhs === 'number') {
            return G3.fromScalar(lhs).add(this)
        }
        else {
            return void 0
        }
    }
    /**
     * @method __sub__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __sub__(rhs: any) {
        if (rhs instanceof G3) {
            return G3.copy(this).sub(rhs)
        }
        else if (typeof rhs === 'number') {
            return G3.fromScalar(rhs).neg().add(this)
        }
        else {
            return void 0
        }
    }
    /**
     * @method __rsub__
     * @param lhs {any}
     * @return {G3}
     * @private
     */
    __rsub__(lhs: any) {
        if (lhs instanceof G3) {
            return G3.copy(lhs).sub(this)
        }
        else if (typeof lhs === 'number') {
            return G3.fromScalar(lhs).sub(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __wedge__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __wedge__(rhs: any) {
        if (rhs instanceof G3) {
            return G3.copy(this).ext(rhs)
        }
        else if (typeof rhs === 'number') {
            // The outer product with a scalar is scalar multiplication.
            return G3.copy(this).scale(rhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rwedge__
     * @param lhs {any}
     * @return {G3}
     * @private
     */
    __rwedge__(lhs: any) {
        if (lhs instanceof G3) {
            return G3.copy(lhs).ext(this)
        }
        else if (typeof lhs === 'number') {
            // The outer product with a scalar is scalar multiplication, and commutes.
            return G3.copy(this).scale(lhs)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __lshift__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __lshift__(rhs: any) {
        if (rhs instanceof G3) {
            return G3.copy(this).lco(rhs)
        }
        else if (typeof rhs === 'number') {
            return G3.copy(this).lco(G3.fromScalar(rhs))
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rlshift__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __rlshift__(lhs: any) {
        if (lhs instanceof G3) {
            return G3.copy(lhs).lco(this)
        }
        else if (typeof lhs === 'number') {
            return G3.fromScalar(lhs).lco(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rshift__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __rshift__(rhs: any) {
        if (rhs instanceof G3) {
            return G3.copy(this).rco(rhs)
        }
        else if (typeof rhs === 'number') {
            return G3.copy(this).rco(G3.fromScalar(rhs))
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rrshift__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __rrshift__(lhs: any) {
        if (lhs instanceof G3) {
            return G3.copy(lhs).rco(this)
        }
        else if (typeof lhs === 'number') {
            return G3.fromScalar(lhs).rco(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __vbar__
     * @param rhs {any}
     * @return {G3}
     * @private
     */
    __vbar__(rhs: any) {
        if (rhs instanceof G3) {
            return G3.copy(this).scp(rhs)
        }
        else if (typeof rhs === 'number') {
            return G3.copy(this).scp(G3.fromScalar(rhs))
        }
        else {
            return void 0
        }
    }

    /**
     * @method __rvbar__
     * @param lhs {any}
     * @return {G3}
     * @private
     */
    __rvbar__(lhs: any) {
        if (lhs instanceof G3) {
            return G3.copy(lhs).scp(this)
        }
        else if (typeof lhs === 'number') {
            return G3.fromScalar(lhs).scp(this)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __pos__
     * @return {G3}
     * @private
     * @chainable
     */
    __pos__() {
        return G3.copy(this)/*.pos()*/
    }

    /**
     * @method __neg__
     * @return {G3}
     * @private
     * @chainable
     */
    __neg__() {
        return G3.copy(this).neg()
    }

    /**
     * @method copy
     * @param M {GeometricE3}
     * @return {G3}
     * @static
     */
    static copy(M: GeometricE3): G3 {
        var copy = new G3()
        copy.w = M.w
        copy.x = M.x
        copy.y = M.y
        copy.z = M.z
        copy.yz = M.yz
        copy.zx = M.zx
        copy.xy = M.xy
        copy.xyz = M.xyz
        return copy
    }

    /**
     * @method fromScalar
     * @param α {number}
     * @return {G3}
     * @static
     * @chainable
     */
    static fromScalar(α: number): G3 {
        var copy = new G3()
        copy.w = α
        return copy
    }

    /**
     * @method fromSpinor
     * @param spinor {SpinorE3}
     * @return {G3}
     * @static
     * @chainable
     */
    static fromSpinor(spinor: SpinorE3): G3 {
        var copy = new G3()
        copy.w = spinor.w
        copy.yz = spinor.yz
        copy.zx = spinor.yz
        copy.xy = spinor.xy
        return copy
    }

    /**
     * @method fromVector
     * @param vector {VectorE3}
     * @return {G3}
     * @static
     * @chainable
     */
    static fromVector(vector: VectorE3): G3 {
        var copy = new G3()
        copy.x = vector.x
        copy.y = vector.y
        copy.z = vector.z
        return copy
    }

    /**
    * @method lerp
    * @param A {GeometricE3}
    * @param B {GeometricE3}
    * @param α {number}
    * @return {G3} <code>A + α * (B - A)</code>
    * @static
    * @chainable
    */
    static lerp(A: GeometricE3, B: GeometricE3, α: number): G3 {
        return G3.copy(A).lerp(B, α)
    }
}

export = G3