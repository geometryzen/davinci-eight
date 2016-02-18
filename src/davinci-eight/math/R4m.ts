import ColumnVector from '../math/ColumnVector';
import VectorE4 from '../math/VectorE4'
import MutableLinearElement from '../math/MutableLinearElement'
import SpinorE4 from '../math/SpinorE4'
import VectorN from '../math/VectorN'
import Mat4R from '../math/Mat4R'

/**
 * @module EIGHT
 * @submodule math
 */

/**
 * @class R4m
 */
export default class R4m extends VectorN<number> implements ColumnVector<Mat4R, R4m>, VectorE4, MutableLinearElement<VectorE4, R4m, SpinorE4, VectorE4> {

    /**
     * @class R4m
     * @constructor
     * @param data {number[]} Default is [0, 0, 0, 0] corresponding to x, y, z, and w coordinate labels.
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

    add(vector: VectorE4, α = 1) {
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

    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     *
     * @method applyMatrix
     * @param m The 4x4 matrix that pre-multiplies this column vector.
     * @return {R4m} <code>this</code>
     * @chainable
     */
    applyMatrix(m: Mat4R): R4m {

        const x = this.x
        const y = this.y
        const z = this.z
        const w = this.w

        const e = m.elements;

        this.x = e[0x0] * x + e[0x4] * y + e[0x8] * z + e[0xC] * w
        this.y = e[0x1] * x + e[0x5] * y + e[0x9] * z + e[0xD] * w
        this.z = e[0x2] * x + e[0x6] * y + e[0xA] * z + e[0xE] * w
        this.w = e[0x3] * x + e[0x7] * y + e[0xB] * z + e[0xF] * w

        return this
    }

    clone() {
        return new R4m([this.x, this.y, this.z, this.w], this.modified);
    }

    copy(v: VectorE4) {
        this.x = v.x
        this.y = v.y
        this.z = v.z
        this.w = v.w
        return this
    }

    divByScalar(α: number) {
        this.x /= α
        this.y /= α
        this.z /= α
        this.w /= α
        return this
    }

    lerp(target: VectorE4, α: number) {
        this.x += (target.x - this.x) * α;
        this.y += (target.y - this.y) * α;
        this.z += (target.z - this.z) * α;
        this.w += (target.w - this.w) * α;
        return this;
    }
    lerp2(a: VectorE4, b: VectorE4, α: number): R4m {
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
        return this
    }
    magnitude(): number {
        throw new Error("TODO: R4m.magnitude()")
    }
    squaredNorm(): number {
        throw new Error("TODO: R4m.squaredNorm()")
    }
    toExponential(): string {
        return "TODO R4m.toExponential"
    }
    toFixed(digits?: number): string {
        return "TODO R4m.toFixed"
    }
    zero(): R4m {
        this.x = 0
        this.y = 0
        this.z = 0
        this.w = 0
        return this
    }
}
