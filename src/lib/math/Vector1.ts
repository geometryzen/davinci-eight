import { Coords } from '../math/Coords';
import { Matrix1 } from '../math/Matrix1';
import { SpinorE1 } from '../math/SpinorE1';
import { VectorE0 } from '../math/VectorE0';
import { VectorE1 } from '../math/VectorE1';

const exp = Math.exp;
const log = Math.log;
const sqrt = Math.sqrt;

const COORD_X = 0;

/**
 * @class Vector1
 */
export class Vector1 extends Coords implements VectorE1 {

    /**
     * @class Vector1
     * @constructor
     * @param data {number[]} Default is [0].
     * @param modified {boolean} Default is false.
     */
    constructor(data = [0], modified = false) {
        super(data, modified, 1);
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

    set(x: number): Vector1 {
        this.x = x;
        return this;
    }

    add(vector: VectorE1, alpha = 1) {
        this.x += vector.x * alpha;
        return this;
    }

    add2(a: VectorE1, b: VectorE1) {
        this.x = a.x + b.x;
        return this;
    }

    scp(v: VectorE1) {
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ σ * this<sup>T</sup></code>
     * </p>
     *
     * @method applyMatrix
     * @param σ {Matrix1}
     * @return {Vector1} <code>this</code>
     * @chainable
     */
    applyMatrix(σ: Matrix1): Vector1 {
        const x = this.x;

        const e = σ.elements;

        this.x = e[0x0] * x;

        return this;
    }

    /**
     * @method approx
     * @param n {number}
     * @return {Vector1}
     * @chainable
     */
    approx(n: number): Vector1 {
        super.approx(n);
        return this;
    }

    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     * 
     * @returns conj(this)
     */
    conj() {
        return this;
    }

    copy(v: VectorE1) {
        this.x = v.x;
        return this;
    }
    det(): number {
        return this.x;
    }
    dual() {
        return this;
    }
    exp() {
        this.x = exp(this.x);
        return this;
    }
    one() {
        this.x = 1;
        return this;
    }
    inv() {
        this.x = 1 / this.x;
        return this;
    }
    lco(v: VectorE1) {
        return this;
    }
    log() {
        this.x = log(this.x);
        return this;
    }
    mul(v: VectorE1) {
        this.x *= v.x;
        return this;
    }
    norm() {
        return this;
    }
    div(v: VectorE1) {
        this.x /= v.x;
        return this;
    }
    divByScalar(scalar: number) {
        this.x /= scalar;
        return this;
    }
    min(v: VectorE1) {
        if (this.x > v.x) {
            this.x = v.x;
        }
        return this;
    }
    max(v: VectorE1) {
        if (this.x < v.x) {
            this.x = v.x;
        }
        return this;
    }
    floor() {
        this.x = Math.floor(this.x);
        return this;
    }
    ceil() {
        this.x = Math.ceil(this.x);
        return this;
    }
    rev() {
        return this;
    }
    rco(v: VectorE1) {
        return this;
    }
    round() {
        this.x = Math.round(this.x);
        return this;
    }
    roundToZero() {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
        return this;
    }
    scale(scalar: number) {
        this.x *= scalar;
        return this;
    }
    stress(σ: VectorE1) {
        this.x *= σ.x;
        return this;
    }
    sub(v: VectorE1) {
        this.x -= v.x;
        return this;
    }
    subScalar(s: number) {
        this.x -= s;
        return this;
    }
    sub2(a: VectorE1, b: VectorE1): Vector1 {
        this.x = a.x - b.x;
        return this;
    }
    /**
     * @method neg
     * @return {Vector1} <code>this</code>
     */
    neg() {
        this.x = -this.x;
        return this;
    }

    /**
     * @method distanceTo
     * @param point {VectorE1}
     * @return {number}
     */
    distanceTo(position: VectorE1) {
        return sqrt(this.quadranceTo(position));
    }
    dot(v: VectorE1) {
        return this.x * v.x;
    }

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number {
        return sqrt(this.squaredNorm());
    }

    normalize(): Vector1 {
        return this.divByScalar(this.magnitude());
    }

    mul2(a: VectorE1, b: VectorE1) {
        return this;
    }
    quad() {
        let x = this.x;
        this.x = x * x;
        return this;
    }
    squaredNorm(): number {
        return this.x * this.x;
    }
    quadranceTo(position: VectorE1) {
        let dx = this.x - position.x;
        return dx * dx;
    }
    reflect(n: VectorE1): Vector1 {
        // FIXME: TODO
        return this;
    }
    reflection(n: VectorE0): Vector1 {
        // FIXME: TODO
        return this;
    }

    rotate(rotor: SpinorE1): Vector1 {
        return this;
    }

    /**
     * this ⟼ this + α * (v - this)</code>
     * @method lerp
     * @param v {VectorE1}
     * @param α {number}
     * @return {MutanbleNumber}
     * @chainable
     */
    lerp(v: VectorE1, α: number) {
        this.x += (v.x - this.x) * α;
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ a + α * (b - a)</code>
     * </p>
     * @method lerp2
     * @param a {Vector1}
     * @param b {Vector1}
     * @param α {number}
     * @return {Vector1}
     * @chainable
     */
    lerp2(a: Vector1, b: Vector1, α: number) {
        this.sub2(b, a).scale(α).add(a);
        return this;
    }
    equals(v: VectorE1) {
        return v.x === this.x;
    }
    fromArray(array: number[], offset = 0) {
        this.x = array[offset];
        return this;
    }
    toArray(array: number[] = [], offset = 0) {
        array[offset] = this.x;
        return array;
    }
    toExponential(fractionDigits?: number): string {
        return "TODO: Vector1.toExponential";
    }
    toFixed(fractionDigits?: number): string {
        return "TODO: Vector1.toFixed";
    }
    toPrecision(precision?: number): string {
        return "TODO: Vector1.toPrecision";
    }
    toString(radix?: number): string {
        return "TODO: Vector1.toString";
    }

    /**
     * @method translation
     * @param d {VectorE0}
     * @return {Vector1}
     * @chainable
     */
    translation(d: VectorE0): Vector1 {
        return this.one();
    }

    fromAttribute(attribute: { itemSize: number, array: number[] }, index: number, offset = 0) {
        index = index * attribute.itemSize + offset;
        this.x = attribute.array[index];
        return this;
    }
    clone() {
        return new Vector1([this.x]);
    }
    ext(v: VectorE1) {
        return this;
    }

    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Vector1}
     * @chainable
     */
    zero(): Vector1 {
        this.x = 0;
        return this;
    }

    /**
     * @method random
     * @return {Vector1}
     * @static
     * @chainable
     */
    static random(): Vector1 {
        return new Vector1([Math.random()]);
    }

    /**
     *
     */
    static zero(): Vector1 {
        return new Vector1([0]);
    }
}
