import ColumnVector from './ColumnVector';
import VectorE3 from './VectorE3';
import dotVectorE3 from './dotVectorE3';
// import G3 from './G3';
import MutableLinearElement from './MutableLinearElement';
import Matrix3 from './Matrix3';
import Matrix4 from './Matrix4';
import isDefined from '../checks/isDefined';
import isNumber from '../checks/isNumber';
import SpinorE3 from './SpinorE3';
import toStringCustom from './toStringCustom';
import Unit from './Unit';
import VectorN from './VectorN';
import wedgeXY from './wedgeXY';
import wedgeYZ from './wedgeYZ';
import wedgeZX from './wedgeZX';

/**
 * @module EIGHT
 * @submodule math
 */

const sqrt = Math.sqrt

const COORD_X = 0
const COORD_Y = 1
const COORD_Z = 2
const BASIS_LABELS = ['e1', 'e2', 'e3']

/**
 * Coordinates corresponding to basis labels.
 */
function coordinates(m: VectorE3): number[] {
    return [m.x, m.y, m.z]
}

/**
 * @class Vector3
 * @extends VectorN<number>
 */
export default class Vector3 extends VectorN<number> implements ColumnVector<Matrix3, Vector3>, VectorE3, MutableLinearElement<VectorE3, Vector3, SpinorE3, VectorE3> {

    /**
     * @property uom
     * @type Unit
     */
    public uom: Unit

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
     * @class Vector3
     * @constructor
     * @param [data = [0, 0, 0]] {number[]}
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
     * @param vector {Vector3}
     * @param [α = 1] {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    add(vector: VectorE3, α = 1) {
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
     * @return {Vector3} <code>this</code>
     * @chainable
     * @deprecated Use copy(a).add(b) instead.
     */
    add2(a: VectorE3, b: VectorE3): Vector3 {
        this.x = a.x + b.x
        this.y = a.y + b.y
        this.z = a.z + b.z
        return this
    }

    /**
     * <p>
     * <code>this ⟼ m * this<sup>T</sup></code>
     * </p>
     * @method applyMatrix
     * @param m {Matrix3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    applyMatrix(m: Matrix3): Vector3 {
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
     * @method applyMatrix4
     * @param m The 4x4 matrix that pre-multiplies this column vector.
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    applyMatrix4(m: Matrix4): Vector3 {

        var x = this.x, y = this.y, z = this.z;

        var e = m.elements;

        this.x = e[0x0] * x + e[0x4] * y + e[0x8] * z + e[0xC];
        this.y = e[0x1] * x + e[0x5] * y + e[0x9] * z + e[0xD];
        this.z = e[0x2] * x + e[0x6] * y + e[0xA] * z + e[0xE];

        return this;
    }

    /**
     * <p>
     * <code>this ⟼ - n * this * n</code>
     * </p>
     * @method reflect
     * @param n {VectorE3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    reflect(n: VectorE3) {
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
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    rotate(R: SpinorE3): Vector3 {
        const x = this.x;
        const y = this.y;
        const z = this.z;

        const a = R.xy;
        const b = R.yz;
        const c = R.zx;
        const w = R.α;

        const ix = w * x - c * z + a * y;
        const iy = w * y - a * x + b * z;
        const iz = w * z - b * y + c * x;
        const iw = b * x + c * y + a * z;

        this.x = ix * w + iw * b + iy * a - iz * c;
        this.y = iy * w + iw * c + iz * b - ix * a;
        this.z = iz * w + iw * a + ix * c - iy * b;

        return this;
    }
    /**
     * @method clone
     * @return {Vector3} <code>copy(this)</code>
     */
    clone() {
        return new Vector3([this.x, this.y, this.z]);
    }

    /**
     * <p>
     * <code>this ⟼ copy(v)</code>
     * </p>
     * @method copy
     * @param v {VectorE3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    copy(v: VectorE3) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    /**
     * Copies the coordinate values into this <code>Vector3</code>.
     * @method copyCoordinates
     * @param coordinates {number[]}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    copyCoordinates(coordinates: number[]): Vector3 {
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
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    cross(v: VectorE3): Vector3 {
        return this.cross2(this, v);
    }
    /**
     * <p>
     * <code>this ⟼ a ✕ b</code>
     * </p>
     * @method cross2
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    cross2(a: VectorE3, b: VectorE3): Vector3 {

        const ax = a.x, ay = a.y, az = a.z;
        const bx = b.x, by = b.y, bz = b.z;

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
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    divByScalar(α: number) {
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
        return Vector3.dot(this, v);
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
     * @return {Vector3} <code>this</code>
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
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    lerp(target: VectorE3, α: number) {
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
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    lerp2(a: VectorE3, b: VectorE3, α: number) {
        this.copy(a).lerp(b, α)
        return this
    }
    /**
     * <p>
     * <code>this ⟼ this / norm(this)</code>
     * </p>
     * @method direction
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    direction(): Vector3 {
        return this.divByScalar(this.magnitude());
    }
    /**
     * <p>
     * <code>this ⟼ this * α</code>
     * </p>
     * @method scale
     * @param α {number} 
     */
    scale(α: number): Vector3 {
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
     * @return {Vector3} <code>this</code>
     * @chainable
     * @deprecated
     */
    setXYZ(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
        return this
    }

    /**
     * @method setY
     * @param {number}
     * @deprecated
     */
    // FIXME: This is used by Cone and Cylinder Simplex PrimitivesBuilder
    setY(y: number): Vector3 {
        this.y = y;
        return this;
    }

    slerp(target: VectorE3, α: number) {
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
     * @param [α = 1] {number}
     * @return {Vector3} <code>this</code>
     * @chainable
     */
    sub(v: VectorE3, α = 1): Vector3 {
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
     * @return {Vector3} <code>this</code>
     * @chainable
     * @deprecated Use copy(a).sub(b) instead.
     */
    sub2(a: VectorE3, b: VectorE3) {
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
     * @param [digits] {number}
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
     * @return {Vector3}
     * @chainable
     */
    zero(): Vector3 {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    }

    __add__(rhs: Vector3): Vector3 {
        if (rhs instanceof Vector3) {
            return this.clone().add(rhs, 1.0);
        }
        else {
            return void 0;
        }
    }
    __sub__(rhs: Vector3): Vector3 {
        if (rhs instanceof Vector3) {
            return this.clone().sub(rhs);
        }
        else {
            return void 0;
        }
    }

    /**
     * @method mul
     * @param rhs {number}
     * @return {Vector3}
     * @private
     */
    __mul__(rhs: number): Vector3 {
        if (isNumber(rhs)) {
            return this.clone().scale(rhs);
        }
        else {
            return void 0;
        }
    }

    /**
     * @method rmul
     * @param lhs {number}
     * @return {Vector3}
     * @private
     */
    __rmul__(lhs: any): Vector3 {
        if (typeof lhs === 'number') {
            return this.clone().scale(lhs);
        }
        else if (lhs instanceof Matrix3) {
            let m33: Matrix3 = lhs;
            return this.clone().applyMatrix(m33);
        }
        else if (lhs instanceof Matrix4) {
            let m44: Matrix4 = lhs;
            return this.clone().applyMatrix4(m44);
        }
        else {
            return void 0;
        }
    }

    /**
     * @method copy
     * @param vector {VectorE3}
     * @return {Vector3}
     * @static
     */
    static copy(vector: VectorE3): Vector3 {
        return new Vector3([vector.x, vector.y, vector.z])
    }

    /**
     * @method lerp
     * @param a {VectorE3}
     * @param b {VectorE3}
     * @param α {number}
     * @return {Vector3} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: VectorE3, b: VectorE3, α: number): Vector3 {
        return Vector3.copy(b).sub(a).scale(α).add(a)
    }

    /**
     * @method random
     * @return {Vector3}
     * @static
     */
    static random(): Vector3 {
        return new Vector3([Math.random(), Math.random(), Math.random()])
    }

    /**
     * @method vector
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @param [uom] {Unit}
     * @return {Vector3}
     * @static
     */
    static vector(x: number, y: number, z: number, uom?: Unit): Vector3 {
        const v = new Vector3([x, y, z])
        v.uom = uom
        return v
    }
}
