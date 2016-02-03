import ColumnVector from '../math/ColumnVector';
import b2 from '../geometries/b2';
import b3 from '../geometries/b3';
import Mat2R from '../math/Mat2R';
import MutableLinearElement from '../math/MutableLinearElement';
import SpinorE2 from '../math/SpinorE2';
import VectorN from '../math/VectorN';
import VectorE2 from '../math/VectorE2';

const sqrt = Math.sqrt;

const COORD_X = 0;
const COORD_Y = 1;

/**
 * @class R2
 */
export default class R2 extends VectorN<number> implements ColumnVector<Mat2R, R2>, VectorE2, MutableLinearElement<VectorE2, R2, SpinorE2, VectorE2> {
    /**
     * @class R2
     * @constructor
     * @param data {number[]} Default is [0, 0].
     * @param modified {boolean} Default is false.
     */
    constructor(data = [0, 0], modified = false) {
        super(data, modified, 2);
    }

    /**
     * @property x
     * @type Number
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
     * @method copy
     * @param v {{x: number; y: number}}
     * @return {R2}
     * @chainable
     */
    copy(v: { x: number; y: number }): R2 {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    add(v: VectorE2, alpha = 1) {
        this.x += v.x * alpha
        this.y += v.y * alpha
        return this
    }

    add2(a: VectorE2, b: VectorE2) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ m * this<sup>T</sup></code>
     * </p>
     * @method applyMatrix
     * @param m {Mat2R}
     * @return {R2} <code>this</code>
     * @chainable
     */
    applyMatrix(m: Mat2R): R2 {
        let x = this.x;
        let y = this.y;

        let e = m.elements;

        this.x = e[0x0] * x + e[0x2] * y;
        this.y = e[0x1] * x + e[0x3] * y;

        return this;
    }

    /**
     * @method cubicBezier
     * @param t {number}
     * @param controlBegin {VectorE2}
     * @param endPoint {VectorE2}
     * @return {R2}
     */
    cubicBezier(t: number, controlBegin: VectorE2, controlEnd: VectorE2, endPoint: VectorE2): R2 {
        let x = b3(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
        let y = b3(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
        this.x = x;
        this.y = y;
        return this
    }

    sub(v: VectorE2) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    subScalar(s: number) {
        this.x -= s;
        this.y -= s;
        return this;
    }
    sub2(a: VectorE2, b: VectorE2) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    }
    scale(s: number) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    divByScalar(scalar: number) {
        if (scalar !== 0) {
            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
        }
        else {
            this.x = 0;
            this.y = 0;
        }
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
     * @return {R2} <code>this</code>
     * @chainable
     */
    neg() {
        this.x = -this.x
        this.y = -this.y
        return this
    }

    /**
     * @method distanceTo
     * @param point {VectorE2}
     * @return {number}
     */
    distanceTo(position: VectorE2) {
        return sqrt(this.quadranceTo(position));
    }
    dot(v: VectorE2) {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number {
        return sqrt(this.squaredNorm());
    }

    direction() {
        return this.divByScalar(this.magnitude());
    }

    squaredNorm(): number {
        return this.x * this.x + this.y * this.y;
    }

    quadranceTo(position: VectorE2) {
        let dx = this.x - position.x;
        let dy = this.y - position.y;
        return dx * dx + dy * dy;
    }

    /**
     * @method quadraticBezier
     * @param t {number}
     * @param controlPoint {VectorE2}
     * @param endPoint {VectorE2}
     * @return {R2}
     */
    quadraticBezier(t: number, controlPoint: VectorE2, endPoint: VectorE2): R2 {
        let x = b2(t, this.x, controlPoint.x, endPoint.x);
        let y = b2(t, this.y, controlPoint.y, endPoint.y);
        this.x = x;
        this.y = y;
        return this
    }

    reflect(n: VectorE2): R2 {
        // FIXME: TODO
        return this;
    }
    rotate(rotor: SpinorE2): R2 {
        return this;
    }

    /**
     * this ⟼ this + (v - this) * α
     * @method lerp
     * @param v {VectorE2}
     * @param α {number}
     * @return {R2}
     * @chainable 
     */
    lerp(v: VectorE2, α: number) {
        this.x += (v.x - this.x) * α;
        this.y += (v.y - this.y) * α;
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @param α {number}
     * @return {R2} <code>this</code>
     * @chainable
     */
    lerp2(a: VectorE2, b: VectorE2, α: number) {
        this.copy(a).lerp(b, α)
        return this
    }
    equals(v: VectorE2) {
        return ((v.x === this.x) && (v.y === this.y));
    }
    slerp(v: VectorE2, α: number) {
        return this;
    }
    toExponential(): string {
        return "TODO: R2.toExponential"
    }
    toFixed(digits?: number): string {
        return "TODO: R2.toString"
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
    clone() {
        return new R2([this.x, this.y]);
    }

    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {R2}
     * @chainable
     */
    zero(): R2 {
        this.x = 0
        this.y = 0
        return this
    }

    /**
     * @method copy
     * @param vector {{x: number; y: number}}
     * @return {R2}
     * @static
     */
    static copy(vector: { x: number; y: number }): R2 {
        return new R2([vector.x, vector.y])
    }

    /**
     * @method lerp
     * @param a {VectorE2}
     * @param b {VectorE2}
     * @param α {number}
     * @return {R2} <code>a + α * (b - a)</code>
     * @static
     */
    static lerp(a: VectorE2, b: VectorE2, α: number): R2 {
        return R2.copy(b).sub(a).scale(α).add(a)
    }
    /**
     * @method random
     * @return {R2}
     * @static
     */
    static random(): R2 {
        return new R2([Math.random(), Math.random()])
    }

}
