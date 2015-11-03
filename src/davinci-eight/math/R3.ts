import VectorE3 = require('../math/VectorE3');
import dotVectorE3 = require('../math/dotVectorE3')
import Euclidean3 = require('../math/Euclidean3')
import expectArg = require('../checks/expectArg')
import MutableLinearElement = require('../math/MutableLinearElement')
import Matrix3 = require('../math/Matrix3')
import Matrix4 = require('../math/Matrix4')
import isDefined = require('../checks/isDefined')
import isNumber = require('../checks/isNumber')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import SpinorE3 = require('../math/SpinorE3')
import toStringCustom = require('../math/toStringCustom')
import VectorN = require('../math/VectorN')
import wedgeXY = require('../math/wedgeXY')
import wedgeYZ = require('../math/wedgeYZ')
import wedgeZX = require('../math/wedgeZX')

let exp = Math.exp
let log = Math.log
let sqrt = Math.sqrt

let COORD_X = 0
let COORD_Y = 1
let COORD_Z = 2
let BASIS_LABELS = ['e1', 'e2', 'e3']

/**
 * Coordinates corresponding to basis labels.
 */
function coordinates(m: VectorE3): number[] {
    return [m.x, m.y, m.z]
}

/**
 * @class R3
 * @extends VectorN<number>
 */
class R3 extends VectorN<number> implements VectorE3, MutableLinearElement<VectorE3, R3, SpinorE3, VectorE3> {
    /**
     * @property e1
     * @type {Euclidean3}
     * @static
     */
    public static e1 = Euclidean3.e1;
    /**
     * @property e2
     * @type {Euclidean3}
     * @static
     */
    public static e2 = Euclidean3.e2;
    /**
     * @property e3
     * @type {Euclidean3}
     * @static
     */
    public static e3 = Euclidean3.e3;
    /**
     * @method dot
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {number}
     * @static
     */
    public static dot(a: VectorE3, b: VectorE3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    /**
     * @class R3
     * @constructor
     * @param data [number[] = [0, 0, 0]]
     * @param modified [boolean = false]
     */
    constructor(data: number[] = [0, 0, 0], modified = false) {
        super(data, modified, 3);
    }
    /**
     * @property x
     * @type {number}
     */
    get x(): number {
        return this.coords[COORD_X];
    }
    set x(value: number) {
        this.modified = this.modified || this.x !== value;
        this.coords[COORD_X] = value;
    }
    /**
     * @property y
     * @type Number
     */
    get y(): number {
        return this.coords[COORD_Y];
    }
    set y(value: number) {
        this.modified = this.modified || this.y !== value;
        this.coords[COORD_Y] = value;
    }
    /**
     * @property z
     * @type Number
     */
    get z(): number {
        return this.coords[COORD_Z];
    }
    set z(value: number) {
        this.modified = this.modified || this.z !== value;
        this.coords[COORD_Z] = value;
    }
    /**
     * <p>
     * <code>this ⟼ this + vector * α</code>
     * </p>
     * @method add
     * @param vector {R3}
     * @param α [number = 1]
     * @return {R3} <code>this</code>
     * @chainable
     */
    add(vector: VectorE3, α: number = 1) {
        mustBeObject('vector', vector)
        mustBeNumber('α', α)
        this.x += vector.x * α
        this.y += vector.y * α
        this.z += vector.z * α
        return this
    }
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     * @method add2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {R3} <code>this</code>
     * @chainable
     */
    add2(a: VectorE3, b: VectorE3): R3 {
        mustBeObject('a', a)
        mustBeObject('b', b)
        this.x = a.x + b.x
        this.y = a.y + b.y
        this.z = a.z + b.z
        return this
    }
    /**
     * <p>
     * <code>this ⟼ m * this</code>
     * </p>
     * @method applyMatrix3
     * @param m {Matrix3}
     * @return {R3} <code>this</code>
     * @chainable
     * @deprecated
     */
    applyMatrix3(m: Matrix3): R3 {
        let x = this.x;
        let y = this.y;
        let z = this.z;

        let e = m.elements;

        this.x = e[0x0] * x + e[0x3] * y + e[0x6] * z;
        this.y = e[0x1] * x + e[0x4] * y + e[0x7] * z;
        this.z = e[0x2] * x + e[0x5] * y + e[0x8] * z;

        return this;
    }
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     * Strictly speaking, this method does not make much sense because the dimensions
     * of the square matrix and column vector don't match.
     * TODO: Used by TubeSimplexGeometry.
     * @method applyMatrix
     * @param m The 4x4 matrix that pre-multiplies this column vector.
     * @return {R3} <code>this</code>
     * @chainable
     * @deprecated
     */
    applyMatrix4(m: Matrix4): R3 {

        var x = this.x, y = this.y, z = this.z;

        var e = m.elements;

        this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
        this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

        return this;
    }
    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     * @method reflect
     * @param n {VectorE3}
     * @return {R3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3) {
        mustBeObject('n', n);
        let ax = this.x;
        let ay = this.y;
        let az = this.z;
        let nx = n.x;
        let ny = n.y;
        let nz = n.z;
        let dot2 = (ax * nx + ay * ny + az * nz) * 2;
        this.x = ax - dot2 * nx;
        this.y = ay - dot2 * ny;
        this.z = az - dot2 * nz;
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ R * this * rev(R)</code>
     * </p>
     * @method rotate
     * @param R {SpinorE3}
     * @return {R3} <code>this</code>
     * @chainable
     */
    rotate(R: SpinorE3): R3 {
        mustBeObject('R', R);
        let x = this.x;
        let y = this.y;
        let z = this.z;

        let a = R.xy;
        let b = R.yz;
        let c = R.zx;
        let w = R.α;

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
     * @method clone
     * @return {R3} <code>copy(this)</code>
     */
    clone() {
        return new R3([this.x, this.y, this.z]);
    }

    /**
     * <p>
     * <code>this ⟼ copy(v)</code>
     * </p>
     * @method copy
     * @param v {VectorE3}
     * @return {R3} <code>this</code>
     * @chainable
     */
    copy(v: VectorE3) {
        mustBeObject('v', v);
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    /**
     * Copies the coordinate values into this <code>R3</code>.
     * @method copyCoordinates
     * @param coordinates {number[]}
     * @return {R3} <code>this</code>
     * @chainable
     */
    copyCoordinates(coordinates: number[]): R3 {
        // Copy using the setters so that the modified flag is updated.
        this.x = coordinates[COORD_X];
        this.y = coordinates[COORD_Y];
        this.z = coordinates[COORD_Z];
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this ✕ v</code>
     * </p>
     * @method cross
     * @param v {VectorE3}
     * @return {R3} <code>this</code>
     * @chainable
     */
    cross(v: VectorE3): R3 {
        mustBeObject('v', v);
        return this.cross2(this, v);
    }
    /**
     * <p>
     * <code>this ⟼ a ✕ b</code>
     * </p>
     * @method cross2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {R3} <code>this</code>
     * @chainable
     */
    cross2(a: VectorE3, b: VectorE3): R3 {
        mustBeObject('a', a);
        mustBeObject('b', b);

        let ax = a.x, ay = a.y, az = a.z;
        let bx = b.x, by = b.y, bz = b.z;

        this.x = wedgeYZ(ax, ay, az, bx, by, bz);
        this.y = wedgeZX(ax, ay, az, bx, by, bz);
        this.z = wedgeXY(ax, ay, az, bx, by, bz);

        return this;
    }

    /**
     * @method distanceTo
     * @param point {VectorE3}
     * @return {number}
     */
    distanceTo(point: VectorE3): number {
        if (isDefined(point)) {
            return sqrt(this.quadranceTo(point));
        }
        else {
            return void 0
        }
    }
    /**
     * @method quadranceTo
     * @param point {VectorE3}
     * @return {number}
     */
    quadranceTo(point: VectorE3): number {
        if (isDefined(point)) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            var dz = this.z - point.z;
            return dx * dx + dy * dy + dz * dz;
        }
        else {
            return void 0
        }
    }
    /**
     * <p>
     * <code>this ⟼ this / α</code>
     * </p>
     * @method divByScalar
     * @param α {number}
     * @return {R3} <code>this</code>
     * @chainable
     */
    divByScalar(α: number) {
        mustBeNumber('α', α);
        if (α !== 0) {
            let invScalar = 1 / α;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
        }
        else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    }
    /**
     * @method dot
     * @param v {VectorE3}
     * @return {number}
     */
    dot(v: VectorE3): number {
        return R3.dot(this, v);
    }
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number {
        return sqrt(this.squaredNorm());
    }
    /**
     * @method neg
     * @return {R3} <code>this</code>
     * @chainable
     */
    neg() {
        this.x = -this.x
        this.y = -this.y
        this.z = -this.z
        return this
    }

    /**
     * <p>
     * <code>this ⟼ this + α * (target - this)</code>
     * </p>
     * @method lerp
     * @param target {VectorE3}
     * @param α {number}
     * @return {R3} <code>this</code>
     * @chainable
     */
    lerp(target: VectorE3, α: number) {
        mustBeObject('target', target)
        mustBeNumber('α', α)
        this.x += (target.x - this.x) * α;
        this.y += (target.y - this.y) * α;
        this.z += (target.z - this.z) * α;
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @param α {number}
     * @return {R3} <code>this</code>
     * @chainable
     */
    lerp2(a: VectorE3, b: VectorE3, α: number) {
        mustBeObject('a', a)
        mustBeObject('b', b)
        mustBeNumber('α', α)
        this.copy(a).lerp(b, α)
        return this
    }
    /**
     * <p>
     * <code>this ⟼ this / norm(this)</code>
     * </p>
     * @method normalize
     * @return {R3} <code>this</code>
     * @chainable
     */
    normalize(): R3 {
        return this.divByScalar(this.magnitude());
    }
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number} 
     */
    scale(α: number): R3 {
        mustBeNumber('α', α)
        this.x *= α
        this.y *= α
        this.z *= α
        return this
    }
    /**
     * <p>
     * <code>this ⟼ this</code>, with components modified.
     * </p>
     * @method set
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {R3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setXYZ(x: number, y: number, z: number) {
        this.x = mustBeNumber('x', x)
        this.y = mustBeNumber('y', y)
        this.z = mustBeNumber('z', z)
        return this
    }

    /**
     * @method setX
     * @param x {number}
     * @return {R3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setX(x: number): R3 {
        mustBeNumber('x', x)
        this.x = x;
        return this;
    }

    /**
     * @method setY
     * @param y {number}
     * @return {R3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setY(y: number): R3 {
        mustBeNumber('y', y)
        this.y = y;
        return this;
    }
    /**
     * @method setZ
     * @param z {number}
     * @return {R3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setZ(z: number): R3 {
        mustBeNumber('z', z)
        this.z = z;
        return this;
    }

    slerp(target: VectorE3, α: number) {
        mustBeObject('target', target)
        mustBeNumber('α', α)
        return this;
    }

    /**
     * Returns the (Euclidean) inner product of this vector with itself.
     * @method squaredNorm
     * @return {number} <code>this ⋅ this</code> or <code>norm(this) * norm(this)</code>
     */
    squaredNorm(): number {
        // quad = scp(v, rev(v)) = scp(v, v)
        // TODO: This is correct but could be optimized.
        return dotVectorE3(this, this)
    }

    /**
     * <p>
     * <code>this ⟼ this - v</code>
     * </p>
     * @method sub
     * @param v {VectorE3}
     * @param α [number = 1]
     * @return {R3} <code>this</code>
     * @chainable
     */
    sub(v: VectorE3, α: number = 1): R3 {
        mustBeObject('v', v)
        mustBeNumber('α', α)
        this.x -= v.x * α
        this.y -= v.y * α
        this.z -= v.z * α
        return this
    }

    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     * @method sub2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {R3} <code>this</code>
     * @chainable
     */
    sub2(a: VectorE3, b: VectorE3) {
        mustBeObject('a', a)
        mustBeObject('b', b)
        this.x = a.x - b.x
        this.y = a.y - b.y
        this.z = a.z - b.z
        return this
    }

    /**
     * @method toExponential
     * @return {string}
     */
    toExponential(): string {
        var coordToString = function(coord: number): string { return coord.toExponential() };
        return toStringCustom(coordinates(this), void 0, coordToString, BASIS_LABELS)
    }

    /**
     * @method toFixed
     * @param digits [number]
     * @return {string}
     */
    toFixed(digits?: number): string {
        var coordToString = function(coord: number): string { return coord.toFixed(digits) };
        return toStringCustom(coordinates(this), void 0, coordToString, BASIS_LABELS)
    }

    /**
     * @method toString
     * @return {string}
     */
    toString(): string {
        var coordToString = function(coord: number): string { return coord.toString() };
        return toStringCustom(coordinates(this), void 0, coordToString, BASIS_LABELS)
    }

    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {R3}
     * @chainable
     */
    zero(): R3 {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    }

    __add__(rhs: R3): R3 {
        if (rhs instanceof R3) {
            return this.clone().add(rhs, 1.0);
        }
        else {
            return void 0;
        }
    }
    __sub__(rhs: R3): R3 {
        if (rhs instanceof R3) {
            return this.clone().sub(rhs);
        }
        else {
            return void 0;
        }
    }
    __mul__(rhs: number): R3 {
        if (isNumber(rhs)) {
            return this.clone().scale(rhs);
        }
        else {
            return void 0;
        }
    }

    /**
     * @method copy
     * @param vector {VectorE3}
     * @return {R3}
     * @static
     */
    static copy(vector: VectorE3): R3 {
        return new R3([vector.x, vector.y, vector.z])
    }

    /**
     * @method lerp
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @param α {number}
     * @return {R3} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: VectorE3, b: VectorE3, α: number): R3 {
        return R3.copy(b).sub(a).scale(α).add(a)
    }

    /**
     * @method random
     * @return {R3}
     * @static
     */
    static random(): R3 {
        return new R3([Math.random(), Math.random(), Math.random()])
    }
}

export = R3;
