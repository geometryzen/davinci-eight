import { Coords } from '../math/Coords';
import { Matrix4 } from '../math/Matrix4';
import { SpinorE4 } from '../math/SpinorE4';
import { VectorE4 } from '../math/VectorE4';
/**
 * @hidden
 */
export declare class Vector4 extends Coords {
    /**
     * @param data Default is [0, 0, 0, 0] corresponding to x, y, z, and w coordinate labels.
     * @param modified Default is false.
     */
    constructor(data?: number[], modified?: boolean);
    /**
     * @property x
     * @type Number
     */
    get x(): number;
    set x(value: number);
    /**
     * @property y
     * @type Number
     */
    get y(): number;
    set y(value: number);
    /**
     * @property z
     * @type Number
     */
    get z(): number;
    set z(value: number);
    /**
     * @property w
     * @type Number
     */
    get w(): number;
    set w(value: number);
    setW(w: number): this;
    add(vector: VectorE4, α?: number): this;
    add2(a: VectorE4, b: VectorE4): this;
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     *
     * @method applyMatrix
     * @param σ The 4x4 matrix that pre-multiplies this column vector.
     * @return {Vector4} <code>this</code>
     * @chainable
     */
    applyMatrix(σ: Matrix4): Vector4;
    /**
     * @method approx
     * @param n {number}
     * @return {Vector4}
     * @chainable
     */
    approx(n: number): Vector4;
    clone(): Vector4;
    copy(v: VectorE4): this;
    divByScalar(α: number): this;
    lerp(target: VectorE4, α: number): this;
    lerp2(a: VectorE4, b: VectorE4, α: number): Vector4;
    neg(): this;
    scale(α: number): this;
    reflect(n: VectorE4): this;
    rotate(rotor: SpinorE4): this;
    stress(σ: VectorE4): this;
    sub(v: VectorE4, α: number): this;
    sub2(a: VectorE4, b: VectorE4): this;
    magnitude(): number;
    squaredNorm(): number;
    toExponential(fractionDigits?: number): string;
    toFixed(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    toString(radix?: number): string;
    zero(): Vector4;
}
