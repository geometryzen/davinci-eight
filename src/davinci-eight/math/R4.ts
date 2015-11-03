import VectorE4 = require('../math/VectorE4');
import MutableLinearElement = require('../math/MutableLinearElement');
import expectArg = require('../checks/expectArg');
import SpinorE4 = require('../math/SpinorE4');
import VectorN = require('../math/VectorN');

let exp = Math.exp
let log = Math.log
let sqrt = Math.sqrt

/**
 * @class R4
 */
class R4 extends VectorN<number> implements VectorE4, MutableLinearElement<VectorE4, R4, SpinorE4, VectorE4> {
    /**
     * @class R4
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
        return this.coords[0];
    }
    set x(value: number) {
        this.modified = this.modified || this.x !== value;
        this.coords[0] = value;
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
        return this.coords[1];
    }
    set y(value: number) {
        this.modified = this.modified || this.y !== value;
        this.coords[1] = value;
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
        return this.coords[2];
    }
    set z(value: number) {
        this.modified = this.modified || this.z !== value;
        this.coords[2] = value;
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
        return this.coords[3];
    }
    set w(value: number) {
        this.modified = this.modified || this.w !== value;
        this.coords[3] = value;
    }
    setW(w: number) {
        this.w = w;
        return this;
    }
    add(vector: VectorE4, α: number = 1) {
        this.x += vector.x * α
        this.y += vector.y * α
        this.z += vector.z * α
        this.w += vector.w * α
        return this
    }
    add2(a: VectorE4, b: VectorE4) {
        this.x = a.x + b.x
        this.y = a.y + b.y
        this.z = a.z + b.z
        this.w = a.w + b.w
        return this
    }
    clone() {
        return new R4([this.x, this.y, this.z, this.w]);
    }
    copy(v: VectorE4) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    }
    divByScalar(α: number) {
        this.x /= α;
        this.y /= α;
        this.z /= α;
        this.w /= α;
        return this;
    }
    lerp(target: VectorE4, α: number) {
        this.x += (target.x - this.x) * α;
        this.y += (target.y - this.y) * α;
        this.z += (target.z - this.z) * α;
        this.w += (target.w - this.w) * α;
        return this;
    }
    lerp2(a: VectorE4, b: VectorE4, α: number): R4 {
        this.sub2(b, a).scale(α).add(a)
        return this
    }
    neg() {
        this.x = -this.x
        this.y = -this.y
        this.z = -this.z
        this.w = -this.w
        return this
    }
    scale(α: number) {
        this.x *= α;
        this.y *= α;
        this.z *= α;
        this.w *= α;
        return this;
    }
    reflect(n: VectorE4) {
        // TODO
        return this;
    }
    rotate(rotor: SpinorE4) {
        // TODO
        return this;
    }
    slerp(target: VectorE4, α: number) {
        return this;
    }
    sub(v: VectorE4, α: number) {
        this.x -= v.x * α
        this.y -= v.y * α
        this.z -= v.z * α
        this.w -= v.w * α
        return this;
    }
    sub2(a: VectorE4, b: VectorE4) {
        this.x = a.x - b.x
        this.y = a.y - b.y
        this.z = a.z - b.z
        this.w = a.w - b.w
        return this;
    }
    magnitude(): number {
        throw new Error("TODO: R4.magnitude()")
    }
    squaredNorm(): number {
        throw new Error("TODO: R4.squaredNorm()")
    }
    toExponential(): string {
        return "TODO R4.toExponential"
    }
    toFixed(digits?: number): string {
        return "TODO R4.toFixed"
    }
    zero(): R4 {
        this.x = 0
        this.y = 0
        this.z = 0
        this.w = 0
        return this
    }
}

export = R4;