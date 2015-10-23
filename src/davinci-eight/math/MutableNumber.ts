import VectorE1 = require('../math/VectorE1')
import expectArg = require('../checks/expectArg')
import LinearElement = require('../math/LinearElement')
import Matrix = require('../math/Matrix')
import SpinorE1 = require('../math/SpinorE1')
import VectorN = require('../math/VectorN')
/**
 * @class MutableNumber
 */
class MutableNumber extends VectorN<number> implements VectorE1, LinearElement<VectorE1, MutableNumber, SpinorE1, VectorE1>, Matrix<MutableNumber> {
    /**
     * @class MutableNumber
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
        return this.data[0];
    }
    set x(value: number) {
        this.modified = this.modified || this.x !== value;
        this.data[0] = value;
    }
    set(x: number): MutableNumber {
        this.x = x;
        return this;
    }
    setX(x: number) {
        this.x = x;
        return this;
    }
    copy(v: VectorE1) {
        this.x = v.x;
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
    determinant(): number {
        return this.x
    }
    exp() {
        this.x = Math.exp(this.x)
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
    sub2(a: VectorE1, b: VectorE1): MutableNumber {
        this.x = a.x - b.x
        return this
    }
    identity() {
        this.x = 1
        return this
    }
    multiply(v: VectorE1) {
        this.x *= v.x
        return this
    }
    scale(scalar: number) {
        this.x *= scalar
        return this
    }
    divide(v: VectorE1) {
        this.x /= v.x
        return this
    }
    divideByScalar(scalar: number) {
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
    round() {
        this.x = Math.round(this.x);
        return this;
    }
    roundToZero() {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
        return this;
    }
    negate() {
        this.x = - this.x;
        return this;
    }
    distanceTo(position: VectorE1) {
        return Math.sqrt(this.quadranceTo(position));
    }
    dot(v: VectorE1) {
        return this.x * v.x;
    }
    magnitude(): number {
        return Math.sqrt(this.quaditude());
    }
    normalize() {
        return this.divideByScalar(this.magnitude());
    }
    product(a: VectorE1, b: VectorE1) {
        return this
    }
    quaditude(): number {
        return this.x * this.x;
    }
    quadranceTo(position: VectorE1) {
        let dx = this.x - position.x;
        return dx * dx;
    }
    reflect(n: VectorE1): MutableNumber {
        // FIXME: TODO
        return this;
    }
    rotate(rotor: SpinorE1): MutableNumber {
        return this;
    }
    setMagnitude(l: number) {
        var oldLength = this.magnitude();
        if (oldLength !== 0 && l !== oldLength) {
            this.scale(l / oldLength);
        }
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
     * @param a {MutableNumber}
     * @param b {MutableNumber}
     * @param α {number}
     * @return {MutableNumber}
     * @chainable
     */
    lerp2(a: MutableNumber, b: MutableNumber, α: number) {
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
    toArray(array: number[] = [], offset: number = 0) {
        array[offset] = this.x;
        return array;
    }
    fromAttribute(attribute: { itemSize: number, array: number[] }, index: number, offset: number = 0) {
        index = index * attribute.itemSize + offset;
        this.x = attribute.array[index];
        return this;
    }
    clone() {
        return new MutableNumber([this.x]);
    }
}

export = MutableNumber;
