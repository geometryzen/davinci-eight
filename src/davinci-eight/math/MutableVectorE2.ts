import VectorE2 = require('../math/VectorE2');
import LinearElement = require('../math/LinearElement');
import SpinorE2 = require('../math/SpinorE2');
import VectorN = require('../math/VectorN');
import expectArg = require('../checks/expectArg');

/**
 * @class MutableVectorE2
 */
class MutableVectorE2 extends VectorN<number> implements VectorE2, LinearElement<VectorE2, MutableVectorE2, SpinorE2, VectorE2> {
    /**
     * @class MutableVectorE2
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
        return this.data[0];
    }
    set x(value: number) {
        this.modified = this.modified || this.x !== value;
        this.data[0] = value;
    }
    /**
     * @property y
     * @type Number
     */
    get y(): number {
        return this.data[1];
    }
    set y(value: number) {
        this.modified = this.modified || this.y !== value;
        this.data[1] = value;
    }
    set(x: number, y: number): MutableVectorE2 {
        this.x = x;
        this.y = y;
        return this;
    }
    setX(x: number) {
        this.x = x;
        return this;
    }
    setY(y: number) {
        this.y = y;
        return this;
    }
    copy(v: VectorE2) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    add(v: VectorE2, alpha: number = 1) {
        this.x += v.x * alpha
        this.y += v.y * alpha
        return this
    }
    add2(a: VectorE2, b: VectorE2) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
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
    multiply(v: VectorE2) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }
    scale(s: number) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    divide(v: VectorE2) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }
    divideByScalar(scalar: number) {
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
    negate() {
        this.x = - this.x;
        this.y = - this.y;
        return this;
    }
    distanceTo(position: VectorE2) {
        return Math.sqrt(this.quadranceTo(position));
    }
    dot(v: VectorE2) {
        return this.x * v.x + this.y * v.y;
    }
    magnitude(): number {
        return Math.sqrt(this.quaditude());
    }
    normalize() {
        return this.divideByScalar(this.magnitude());
    }
    quaditude(): number {
        return this.x * this.x + this.y * this.y;
    }
    quadranceTo(position: VectorE2) {
        let dx = this.x - position.x;
        let dy = this.y - position.y;
        return dx * dx + dy * dy;
    }
    reflect(n: VectorE2): MutableVectorE2 {
        // FIXME: TODO
        return this;
    }
    rotate(rotor: SpinorE2): MutableVectorE2 {
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
     * this ⟼ this + (v - this) * α
     * @method lerp
     * @param v {VectorE2}
     * @param α {number}
     * @return {MutableVectorE2}
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
     * @return {MutableVectorE2} <code>this</code>
     * @chainable
     */
    lerp2(a: VectorE2, b: VectorE2, α: number) {
        this.copy(a).lerp(b, α)
        return this
    }
    equals(v: VectorE2) {
        return ((v.x === this.x) && (v.y === this.y));
    }
    fromArray(array: number[], offset: number = 0) {
        this.x = array[offset];
        this.y = array[offset + 1];
        return this;
    }
    fromAttribute(attribute: { itemSize: number, array: number[] }, index: number, offset: number = 0) {
        index = index * attribute.itemSize + offset;
        this.x = attribute.array[index];
        this.y = attribute.array[index + 1];
        return this;
    }
    clone() {
        return new MutableVectorE2([this.x, this.y]);
    }
}

export = MutableVectorE2;
