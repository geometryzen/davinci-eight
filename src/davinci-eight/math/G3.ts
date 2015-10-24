import cartesianQuaditudeE3 = require('../math/cartesianQuaditudeE3')
import euclidean3Quaditude1Arg = require('../math/euclidean3Quaditude1Arg')
import euclidean3Quaditude2Arg = require('../math/euclidean3Quaditude2Arg')
import extG3 = require('../math/extG3')
import GeometricE3 = require('../math/GeometricE3')
import isNumber = require('../checks/isNumber')
import lcoG3 = require('../math/lcoG3')
import GeometricOperators = require('../math/GeometricOperators')
import mulG3 = require('../math/mulG3')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import MutableGeometricElement = require('../math/MutableGeometricElement')
import PseudoscalarEe = require('../math/PseudoscalarE3')
import rcoG3 = require('../math/rcoG3')
import scpG3 = require('../math/scpG3')
import SpinorE3 = require('../math/SpinorE3')
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

/**
 * @class G3
 * @extends GeometricE3
 * @beta
 */
class G3 extends VectorN<number> implements GeometricE3, MutableGeometricElement<GeometricE3, G3, SpinorE3, VectorE3, GeometricE3>, GeometricOperators<G3> {
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
    /**
     * @method clone
     * @return {G3} <code>copy(this)</code>
     */
    clone(): G3 {
        let m = new G3()
        m.copy(this)
        return m
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
        return this.conL2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ a << b</code>
     * </p>
     * @method conL2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    conL2(a: GeometricE3, b: GeometricE3): G3 {
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
        return this.conR2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     * @method conR2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    conR2(a: GeometricE3, b: GeometricE3): G3 {
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
     * @method divideByScalar
     * @param α {number}
     * @return {G3} <code>this</code>
     * @chainable
     */
    divideByScalar(α: number): G3 {
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
        // this.w = a0 * b0 - cartesianQuaditudeE3(a1, a2, a3, b1, b2, b3)
        this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
        this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
        this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ dual(m) = I * m</code>
     * </p>
     * Notice that the dual of a vector is related to the spinor by the right-hand rule.
     * @method dual
     * @param m {GeometricE3} The vector whose dual will be used to set this spinor.
     * @return {G3} <code>this</code>
     * @chainable
     */
    dual(m: VectorE3): G3 {
        // FIXME: TODO
        mustBeObject('m', m)
        this.yz = mustBeNumber('m.x', m.x)
        this.zx = mustBeNumber('m.y', m.y)
        this.xy = mustBeNumber('m.z', m.z)
        this.w = 0
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
        // this.divideByScalar(this.quaditude());
        return this
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
        // FIXME: TODO
        let modulus = this.magnitude()
        this.yz = this.yz / modulus
        this.zx = this.zx / modulus
        this.xy = this.xy / modulus
        this.w = this.w / modulus
        return this
    }
    /**
     * @method quaditude
     * @return {number} <code>this * conj(this)</code>
     */
    quaditude(): number {
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
     * <code>this ⟼ reverse(this)</code>
     * </p>
     * @method reverse
     * @return {G3} <code>this</code>
     * @chainable
     */
    reverse(): G3 {
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
        return G3.copy(this).reverse()
    }
    /**
     * <p>
     * <code>this ⟼ R * this * reverse(R)</code>
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
     * @method rotor
     * @param b {VectorE3} The ending unit vector
     * @param a {VectorE3} The starting unit vector
     * @return {G3} <code>this</code> The rotor representing a rotation from a to b.
     * @chainable
     */
    rotor(b: VectorE3, a: VectorE3): G3 {
        this.spinor(b, a)
        this.w += 1
        var denom = Math.sqrt(2 * (1 + euclidean3Quaditude2Arg(b, a)))
        this.divideByScalar(denom)
        return this;
    }
    /**
     * <p>
     * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
     * </p>
     * @method rotorFromAxisAngle
     * @param axis {VectorE3}
     * @param θ {number}
     * @return {G3} <code>this</code>
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
     * <code>this ⟼ align(this, m)</code>
     * </p>
     * @method align
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    align(m: GeometricE3): G3 {
        return this.align2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ align(a, b)</code>
     * </p>
     * @method align2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    align2(a: GeometricE3, b: GeometricE3): G3 {
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

        this.w = cartesianQuaditudeE3(ax, ay, az, bx, by, bz)
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
     * <p>
     * <code>this ⟼ this ^ m</code>
     * </p>
     * @method wedge
     * @param m {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    wedge(m: GeometricE3): G3 {
        return this.wedge2(this, m)
    }
    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     * @method wedge2
     * @param a {GeometricE3}
     * @param b {GeometricE3}
     * @return {G3} <code>this</code>
     * @chainable
     */
    wedge2(a: GeometricE3, b: GeometricE3): G3 {
        return extG3(a, b, this)
    }

    /**
     * @method __add__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __add__(other: any) {
        if (other instanceof G3) {
            var rhs = <G3>other
            return G3.copy(this).add(rhs)
        }
        else if (isNumber(other)) {
            var m = G3.copy(this)
            m.w += <number>other
            return m
        }
        else {
            return void 0
        }
    }

    /**
     * @method __div__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __div__(other: any) {
        if (other instanceof G3) {
            return G3.copy(this).div(other)
        }
        else if (isNumber(other)) {
            return G3.copy(this).divideByScalar(other)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __mul__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __mul__(other: any) {
        if (other instanceof G3) {
            return G3.copy(this).mul(other)
        }
        else if (isNumber(other)) {
            return G3.copy(this).scale(other)
        }
        else {
            return void 0
        }
    }

    /**
     * @method __radd__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __radd__(other: any) {
        if (other instanceof G3) {
            var rhs = <G3>other
            return G3.copy(other).add(this)
        }
        else if (isNumber(other)) {
            var m = G3.copy(this)/*.pos()*/
            m.w += <number>other
            return m
        }
        else {
            return void 0
        }
    }
    /**
     * @method __sub__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __sub__(other: any) {
        if (other instanceof G3) {
            var rhs = <G3>other
            return G3.copy(this).sub(rhs)
        }
        else if (isNumber(other)) {
            var m = G3.copy(this)
            m.w -= <number>other
            return m
        }
        else {
            return void 0
        }
    }
    /**
     * @method __rsub__
     * @param other {any}
     * @return {G3}
     * @private
     */
    __rsub__(other: any) {
        if (other instanceof G3) {
            var rhs = <G3>other
            return G3.copy(other).sub(this)
        }
        else if (isNumber(other)) {
            var m = G3.copy(this).neg()
            m.w += <number>other
            return m
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
     * @method fromSpinor
     * @param spinor {SpinorE3}
     * @return {G3}
     * @static
     */
    static fromSpinor(spinor: SpinorE3): G3 {
        var copy = new G3()
        copy.w = spinor.w
        copy.x = 0
        copy.y = 0
        copy.z = 0
        copy.yz = spinor.yz
        copy.zx = spinor.yz
        copy.xy = spinor.xy
        copy.xyz = 0
        return copy
    }

    /**
     * @method fromVector
     * @param vector {VectorE3}
     * @return {G3}
     * @static
     */
    static fromVector(vector: VectorE3): G3 {
        var copy = new G3()
        copy.w = 0
        copy.x = vector.x
        copy.y = vector.y
        copy.z = vector.z
        copy.yz = 0
        copy.zx = 0
        copy.xy = 0
        copy.xyz = 0
        return copy
    }
    /**
    * @method lerp
    * @param A {GeometricE3}
    * @param B {GeometricE3}
    * @param α {number}
    * @return {G3} <code>A + α * (B - A)</code>
    * @static
    */
    static lerp(A: GeometricE3, B: GeometricE3, α: number): G3 {
        return G3.copy(A).lerp(B, α)
        // return G3.copy(B).sub(A).scale(α).add(A)
    }

}

export = G3