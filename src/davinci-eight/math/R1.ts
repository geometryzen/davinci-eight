import VectorE1 = require('../math/VectorE1')
import expectArg = require('../checks/expectArg')
import MutableLinearElement = require('../math/MutableLinearElement')
import Matrix = require('../math/Matrix')
import SpinorE1 = require('../math/SpinorE1')
import VectorN = require('../math/VectorN')

let exp = Math.exp
let log = Math.log
let sqrt = Math.sqrt

let COORD_X = 0

/**
 * @class R1
 */
class R1 extends VectorN<number> implements VectorE1, MutableLinearElement<VectorE1, R1, SpinorE1, VectorE1>, Matrix<R1> {
    /**
     * @class R1
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
    set(x: number): R1 {
        this.x = x;
        return this;
    }
    setX(x: number) {
        this.x = x;
        return this;
    }
    add(vector: VectorE1, alpha: number = 1) {
        this.x += vector.x * alpha
        return this
    }
    add2(a: VectorE1, b: VectorE1) {
        this.x = a.x + b.x;
        return this;
    }
    scp(v: VectorE1) {
        return this
    }

    adj(): R1 {
        throw new Error('TODO: R1.adj')
    }

    conj() {
        return this
    }
    copy(v: VectorE1) {
        this.x = v.x;
        return this;
    }
    determinant(): number {
        return this.x
    }
    dual() {
        return this
    }
    exp() {
        this.x = exp(this.x)
        return this
    }
    identity() {
        this.x = 1
        return this
    }
    inv() {
        this.x = 1 / this.x
        return this
    }
    lco(v: VectorE1) {
        return this
    }
    log() {
        this.x = log(this.x)
        return this
    }
    mul(v: VectorE1) {
        this.x *= v.x
        return this
    }
    norm() {
        return this
    }
    div(v: VectorE1) {
        this.x /= v.x
        return this
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
        return this
    }
    rco(v: VectorE1) {
        return this
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
        this.x *= scalar
        return this
    }
    sub(v: VectorE1) {
        this.x -= v.x
        return this
    }
    subScalar(s: number) {
        this.x -= s
        return this
    }
    sub2(a: VectorE1, b: VectorE1): R1 {
        this.x = a.x - b.x
        return this
    }
    /**
     * @method neg
     * @return {R1} <code>this</code>
     */
    neg() {
        this.x = -this.x
        return this
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

    normalize() {
        return this.divByScalar(this.magnitude());
    }
    mul2(a: VectorE1, b: VectorE1) {
        return this
    }
    quad() {
        let x = this.x
        this.x = x * x
        return this
    }
    squaredNorm(): number {
        return this.x * this.x;
    }
    quadranceTo(position: VectorE1) {
        let dx = this.x - position.x;
        return dx * dx;
    }
    reflect(n: VectorE1): R1 {
        // FIXME: TODO
        return this;
    }

    rotate(rotor: SpinorE1): R1 {
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
     * @param a {R1}
     * @param b {R1}
     * @param α {number}
     * @return {R1}
     * @chainable
     */
    lerp2(a: R1, b: R1, α: number) {
        this.sub2(b, a).scale(α).add(a);
        return this;
    }
    equals(v: VectorE1) {
        return v.x === this.x;
    }
    fromArray(array: number[], offset: number = 0) {
        this.x = array[offset];
        return this;
    }
    slerp(v: VectorE1, α: number) {
        return this;
    }
    toArray(array: number[] = [], offset: number = 0) {
        array[offset] = this.x;
        return array;
    }
    toExponential(): string {
        return "TODO: R1.toExponential";
    }
    toFixed(digits?: number): string {
        return "TODO: R1.toFixed";
    }
    fromAttribute(attribute: { itemSize: number, array: number[] }, index: number, offset: number = 0) {
        index = index * attribute.itemSize + offset;
        this.x = attribute.array[index];
        return this;
    }
    clone() {
        return new R1([this.x]);
    }
    ext(v: VectorE1) {
        return this
    }

    /**
     * Sets this vector to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {R1}
     * @chainable
     */
    zero(): R1 {
        this.x = 0
        return this
    }
}

export = R1;
