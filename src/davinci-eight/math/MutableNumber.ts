import Cartesian1 = require('../math/Cartesian1')
import expectArg = require('../checks/expectArg')
import LinearElement = require('../math/LinearElement')
import Matrix = require('../math/Matrix')
import Spinor1Coords = require('../math/Spinor1Coords')
import VectorN = require('../math/VectorN')
/**
 * @class MutableNumber
 */
class MutableNumber extends VectorN<number> implements Cartesian1, LinearElement<Cartesian1, MutableNumber, Spinor1Coords, Cartesian1>, Matrix<MutableNumber> {
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
    copy(v: Cartesian1) {
        this.x = v.x;
        return this;
    }
    add(vector: Cartesian1, alpha: number = 1) {
        this.x += vector.x * alpha
        return this
    }
    addScalar(s: number) {
        this.x += s;
        return this;
    }
    determinant(): number {
        return this.x
    }
    sum(a: Cartesian1, b: Cartesian1) {
        this.x = a.x + b.x;
        return this;
    }
    exp() {
        this.x = Math.exp(this.x);
        return this;
    }
    sub(v: Cartesian1) {
        this.x -= v.x;
        return this;
    }
    subScalar(s: number) {
        this.x -= s;
        return this;
    }
    difference(a: Cartesian1, b: Cartesian1) {
        this.x = a.x - b.x;
        return this;
    }
    identity() {
        this.x = 1
        return this
    }
    multiply(v: Cartesian1) {
        this.x *= v.x;
        return this;
    }
    scale(scalar: number) {
        this.x *= scalar;
        return this;
    }
    divide(v: Cartesian1) {
        this.x /= v.x;
        return this;
    }
    divideScalar(scalar: number) {
        if (scalar !== 0) {
            var invScalar = 1 / scalar;
            this.x *= invScalar;
        }
        else {
            this.x = 0;
        }
        return this;
    }
    min(v: Cartesian1) {
        if (this.x > v.x) {
            this.x = v.x;
        }
        return this;
    }
    max(v: Cartesian1) {
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
    distanceTo(position: Cartesian1) {
        return Math.sqrt(this.quadranceTo(position));
    }
    dot(v: Cartesian1) {
        return this.x * v.x;
    }
    magnitude(): number {
        return Math.sqrt(this.quaditude());
    }
    normalize() {
        return this.divideScalar(this.magnitude());
    }
    product(a: Cartesian1, b: Cartesian1) {
        return this
    }
    quaditude(): number {
        return this.x * this.x;
    }
    quadranceTo(position: Cartesian1) {
        let dx = this.x - position.x;
        return dx * dx;
    }
    reflect(n: Cartesian1): MutableNumber {
        // FIXME: TODO
        return this;
    }
    rotate(rotor: Spinor1Coords): MutableNumber {
        return this;
    }
    setMagnitude(l: number) {
        var oldLength = this.magnitude();
        if (oldLength !== 0 && l !== oldLength) {
            this.scale(l / oldLength);
        }
        return this;
    }
    lerp(v: Cartesian1, alpha: number) {
        this.x += (v.x - this.x) * alpha;
        return this;
    }
    lerpVectors(v1: MutableNumber, v2: MutableNumber, alpha: number) {
        this.difference(v2, v1).scale(alpha).add(v1, 1.0);
        return this;
    }
    equals(v: Cartesian1) {
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
