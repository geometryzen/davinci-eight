import VectorE4 = require('../math/VectorE4');
import LinearElement = require('../math/LinearElement');
import expectArg = require('../checks/expectArg');
import SpinorE4 = require('../math/SpinorE4');
import VectorN = require('../math/VectorN');

/**
 * @class MutableVectorE4
 */
class MutableVectorE4 extends VectorN<number> implements VectorE4, LinearElement<VectorE4, MutableVectorE4, SpinorE4, VectorE4> {
    /**
     * @class MutableVectorE4
     * @constructor
     * @param data {number[]} Default is [0, 0, 0, 0].
     * @param modified {boolean} Default is false.
     */
    constructor(data = [0, 0, 0, 0], modified = false) {
        super(data, modified, 4);
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
    setX(x: number) {
        this.x = x;
        return this;
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
    setY(y: number) {
        this.y = y;
        return this;
    }
    /**
     * @property z
     * @type Number
     */
    get z(): number {
        return this.data[2];
    }
    set z(value: number) {
        this.modified = this.modified || this.z !== value;
        this.data[2] = value;
    }
    setZ(z: number) {
        this.z = z;
        return this;
    }
    /**
     * @property w
     * @type Number
     */
    get w(): number {
        return this.data[3];
    }
    set w(value: number) {
        this.modified = this.modified || this.w !== value;
        this.data[3] = value;
    }
    setW(w: number) {
        this.w = w;
        return this;
    }
    add(vector: VectorE4, alpha: number = 1) {
        this.x += vector.x * alpha
        this.y += vector.y * alpha
        this.z += vector.z * alpha
        this.w += vector.w * alpha
        return this
    }
    sum(a: VectorE4, b: VectorE4) {
        return this;
    }
    clone() {
        return new MutableVectorE4([this.x, this.y, this.z, this.w]);
    }
    copy(v: VectorE4) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    }
    divideByScalar(scalar: number) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        this.w /= scalar;
        return this;
    }
    lerp(target: VectorE4, alpha: number) {
        this.x += (target.x - this.x) * alpha;
        this.y += (target.y - this.y) * alpha;
        this.z += (target.z - this.z) * alpha;
        this.w += (target.w - this.w) * alpha;
        return this;
    }
    lerp2(a: VectorE4, b: VectorE4, α: number): MutableVectorE4 {
        this.diff(b, a).scale(α).add(a)
        return this
    }
    scale(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        this.w *= scalar;
        return this;
    }
    reflect(n: VectorE4) {
        return this;
    }
    rotate(rotor: SpinorE4) {
        return this;
    }
    sub(rhs: VectorE4) {
        return this;
    }
    diff(a: VectorE4, b: VectorE4): MutableVectorE4 {
        return this;
    }
}

export = MutableVectorE4;