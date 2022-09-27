import { VectorN } from '../atoms/VectorN';
import { lock, LockableMixin as Lockable, TargetLockedError } from '../core/Lockable';
import { b2 } from '../geometries/b2';
import { b3 } from '../geometries/b3';
import { notImplemented } from '../i18n/notImplemented';
import { Matrix2 } from '../math/Matrix2';
import { SpinorE2 } from '../math/SpinorE2';
import { stringFromCoordinates } from '../math/stringFromCoordinates';
import { VectorE2 } from '../math/VectorE2';
import { approx } from './approx';
import { randomRange } from './randomRange';

const sqrt = Math.sqrt;

const COORD_X = 0;
const COORD_Y = 1;

/**
 * Coordinates corresponding to basis labels.
 */
function coordinates(m: VectorE2): number[] {
    return [m.x, m.y];
}

/**
 * @hidden
 */
export class Vector2 implements VectorE2, Lockable, VectorN<number> {
    // Lockable
    public isLocked(): boolean {
        return typeof (this as any)['lock_'] === 'number';
    }

    public lock(): number {
        if (this.isLocked()) {
            throw new Error("already locked");
        }
        else {
            (this as any)['lock_'] = Math.random();
            return (this as any)['lock_'];
        }
    }

    public unlock(token: number): void {
        if (typeof token !== 'number') {
            throw new Error("token must be a number.");
        }
        if (!this.isLocked()) {
            throw new Error("not locked");
        }
        else if ((this as any)['lock_'] === token) {
            (this as any)['lock_'] = void 0;
        }
        else {
            throw new Error("unlock denied");
        }
    }

    /**
     * 
     */
    private coords_: number[];

    /**
     * 
     */
    private modified_: boolean;

    /**
     * @param coords The x coordinate and y coordinate.
     * @param modified
     */
    constructor(coords = [0, 0], modified = false) {
        this.coords_ = coords;
        this.modified_ = modified;
    }

    get length(): number {
        return 2;
    }

    get modified(): boolean {
        return this.modified_;
    }
    set modified(modified: boolean) {
        if (this.isLocked()) {
            throw new TargetLockedError('set modified');
        }
        this.modified_ = modified;
    }

    getComponent(i: number): number {
        return this.coords_[i];
    }



    /**
     *
     */
    get x(): number {
        return this.coords_[COORD_X];
    }
    set x(value: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set x');
        }
        const coords = this.coords_;
        this.modified_ = this.modified_ || coords[COORD_X] !== value;
        coords[COORD_X] = value;
    }

    /**
     *
     */
    get y(): number {
        return this.coords_[COORD_Y];
    }

    set y(value: number) {
        if (this.isLocked()) {
            throw new TargetLockedError('set y');
        }
        const coords = this.coords_;
        this.modified_ = this.modified_ || coords[COORD_Y] !== value;
        coords[COORD_Y] = value;
    }

    /**
     * @param v
     * @param α
     * @returns
     */
    add(v: VectorE2, α = 1): Vector2 {
        this.x += v.x * α;
        this.y += v.y * α;
        return this;
    }

    /**
     * @param a
     * @param b
     * @returns
     */
    add2(a: VectorE2, b: VectorE2): Vector2 {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ σ * this<sup>T</sup></code>
     * </p>
     *
     * @method applyMatrix
     * @param σ {Matrix2}
     * @return {Vector2} <code>this</code>
     * @chainable
     */
    applyMatrix(σ: Matrix2): Vector2 {
        const x = this.x;
        const y = this.y;

        const e = σ.elements;

        this.x = e[0x0] * x + e[0x2] * y;
        this.y = e[0x1] * x + e[0x3] * y;

        return this;
    }

    /**
     * @method approx
     * @param n {number}
     * @return {Vector2}
     * @chainable
     */
    approx(n: number): Vector2 {
        approx(this.coords_, n);
        return this;
    }

    /**
     * @method clone
     * @return {Vector2}
     * @chainable
     */
    clone(): Vector2 {
        return new Vector2([this.x, this.y]);
    }

    /**
     * @method copy
     * @param v {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    copy(v: VectorE2): Vector2 {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    /**
     * @method cubicBezier
     * @param t {number}
     * @param controlBegin {VectorE2}
     * @param endPoint {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    cubicBezier(t: number, controlBegin: VectorE2, controlEnd: VectorE2, endPoint: VectorE2): Vector2 {
        const x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
        const y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * @method distanceTo
     * @param point {VectorE2}
     * @return {number}
     */
    distanceTo(position: VectorE2) {
        return sqrt(this.quadranceTo(position));
    }

    /**
     * @method sub
     * @param v {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    sub(v: VectorE2): Vector2 {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    /*
    subScalar(s: number) {
        this.x -= s;
        this.y -= s;
        return this;
    }
    */

    /**
     * @method sub2
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @return {Vector2}
     * @chainable
     */
    sub2(a: VectorE2, b: VectorE2): Vector2 {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    }

    /**
     * @method scale
     * @param α {number}
     * @return {Vector2}
     * @chainable
     */
    scale(α: number): Vector2 {
        this.x *= α;
        this.y *= α;
        return this;
    }

    /**
     * @method divByScalar
     * @param α {number}
     * @return {Vector2}
     * @chainable
     */
    divByScalar(α: number) {
        this.x /= α;
        this.y /= α;
        return this;
    }
    min(v: VectorE2) {
        if (this.x > v.x) {
            this.x = v.x;
        }
        if (this.y > v.y) {
            this.y = v.y;
        }
        return this;
    }
    max(v: VectorE2) {
        if (this.x < v.x) {
            this.x = v.x;
        }
        if (this.y < v.y) {
            this.y = v.y;
        }
        return this;
    }
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }
    roundToZero() {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
        return this;
    }

    /**
     * @method neg
     * @return {Vector2} <code>this</code>
     * @chainable
     */
    neg() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    dot(v: VectorE2) {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     *
     * @method magnitude
     * @return {number}
     */
    magnitude(): number {
        return sqrt(this.squaredNorm());
    }

    normalize(): Vector2 {
        return this.divByScalar(this.magnitude());
    }

    squaredNorm(): number {
        return this.x * this.x + this.y * this.y;
    }

    quadranceTo(position: VectorE2) {
        const dx = this.x - position.x;
        const dy = this.y - position.y;
        return dx * dx + dy * dy;
    }

    /**
     * @method quadraticBezier
     * @param t {number}
     * @param controlPoint {VectorE2}
     * @param endPoint {VectorE2}
     * @return {Vector2}
     */
    quadraticBezier(t: number, controlPoint: VectorE2, endPoint: VectorE2): Vector2 {
        const x = b2(t, this.x, controlPoint.x, endPoint.x);
        const y = b2(t, this.y, controlPoint.y, endPoint.y);
        this.x = x;
        this.y = y;
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reflect(n: VectorE2): Vector2 {
        throw new Error(notImplemented('reflect').message);
    }

    /**
     * @method rotate
     * @param spinor {SpinorE2}
     * @return {Vector2}
     * @chainable
     */
    rotate(spinor: SpinorE2): Vector2 {
        const x = this.x;
        const y = this.y;

        const α = spinor.a;
        const β = spinor.b;

        const p = α * α - β * β;
        const q = 2 * α * β;

        this.x = p * x + q * y;
        this.y = p * y - q * x;

        return this;
    }

    /**
     * this ⟼ this + (v - this) * α
     *
     * @method lerp
     * @param v {VectorE2}
     * @param α {number}
     * @return {Vector2}
     * @chainable 
     */
    lerp(v: VectorE2, α: number): Vector2 {
        this.x += (v.x - this.x) * α;
        this.y += (v.y - this.y) * α;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     *
     * @method lerp2
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @param α {number}
     * @return {Vector2} <code>this</code>
     * @chainable
     */
    lerp2(a: VectorE2, b: VectorE2, α: number): Vector2 {
        this.copy(a).lerp(b, α);
        return this;
    }

    equals(v: VectorE2): boolean {
        return ((v.x === this.x) && (v.y === this.y));
    }

    /**
     * @method stress
     * @param σ {VectorE2}
     * @return {Vector2}
     */
    stress(σ: VectorE2) {
        this.x *= σ.x;
        this.y *= σ.y;
        return this;
    }

    /**
     * 
     */
    toArray(): number[] {
        return coordinates(this);
    }

    /**
     * @method toExponential
     * @param [fractionDigits] {number}
     * @return {string}
     */
    toExponential(fractionDigits?: number): string {
        const coordToString = function (coord: number): string { return coord.toExponential(fractionDigits); };
        return stringFromCoordinates(this.coords_, coordToString, ['e1', 'e2']);
    }

    /**
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    toFixed(fractionDigits?: number): string {
        const coordToString = function (coord: number): string { return coord.toFixed(fractionDigits); };
        return stringFromCoordinates(this.coords_, coordToString, ['e1', 'e2']);
    }

    /**
     * @method toPrecision
     * @param [precision] {number}
     * @return {string}
     */
    toPrecision(precision?: number): string {
        const coordToString = function (coord: number): string { return coord.toPrecision(precision); };
        return stringFromCoordinates(this.coords_, coordToString, ['e1', 'e2']);
    }

    /**
     * @method toString
     * @param [radix] {number}
     * @return {string}
     */
    toString(radix?: number): string {
        const coordToString = function (coord: number): string { return coord.toString(radix); };
        return stringFromCoordinates(this.coords_, coordToString, ['e1', 'e2']);
    }

    fromArray(array: number[], offset = 0) {
        this.x = array[offset];
        this.y = array[offset + 1];
        return this;
    }

    fromAttribute(attribute: { itemSize: number, array: number[] }, index: number, offset = 0) {
        index = index * attribute.itemSize + offset;
        this.x = attribute.array[index];
        this.y = attribute.array[index + 1];
        return this;
    }

    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     */
    zero(): Vector2 {
        this.x = 0;
        this.y = 0;
        return this;
    }

    __neg__(): Vector2 {
        return lock(this.clone().neg());
    }

    /**
     * @method copy
     *
     * @param vector {VectorE2}
     * @return {Vector2}
     * @static
     * @chainable
     */
    static copy(vector: VectorE2): Vector2 {
        return Vector2.vector(vector.x, vector.y);
    }

    /**
     * @method lerp
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @param α {number}
     * @return {Vector2} <code>a + α * (b - a)</code>
     * @static
     * @chainable
     */
    static lerp(a: VectorE2, b: VectorE2, α: number): Vector2 {
        return Vector2.copy(b).sub(a).scale(α).add(a);
    }

    /**
     * <p>
     * Computes a unit vector with a random direction.
     * </p>
     */
    static random(): Vector2 {
        const x = randomRange(-1, 1);
        const y = randomRange(-1, 1);
        return Vector2.vector(x, y).normalize();
    }

    static vector(x: number, y: number): Vector2 {
        return new Vector2([x, y]);
    }

    static readonly zero = Vector2.vector(0, 0);
}
Vector2.zero.lock();
