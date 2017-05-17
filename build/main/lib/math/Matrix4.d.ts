import { AbstractMatrix } from '../math/AbstractMatrix';
import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';
/**
 * A 4x4 (square) matrix of numbers.
 *
 * An adapter for a `Float32Array`.
 */
export declare class Matrix4 extends AbstractMatrix<Matrix4> {
    /**
     *
     */
    constructor(elements: Float32Array);
    /**
     * The identity matrix for multiplication, 1.
     * The matrix is locked (immutable), but may be cloned.
     */
    static readonly one: Matrix4;
    /**
     * The identity matrix for addition, 0.
     * The matrix is locked (immutable), but may be cloned.
     */
    static readonly zero: Matrix4;
    /**
     * Constructs a 4x4 matrix that performs the scaling specified by the vector.
     */
    static scaling(scale: VectorE3): Matrix4;
    /**
     * Constructs a 4x4 matrix that performs the translation specified by the vector.
     */
    static translation(vector: VectorE3): Matrix4;
    /**
     * Constructs a 4x4 matrix that performs the rotation specified by the spinor.
     */
    static rotation(spinor: SpinorE3): Matrix4;
    /**
     * Sets this matrix to `this + rhs`.
     */
    add(rhs: Matrix4): this;
    /**
     * Sets this matrix to `a + b`.
     */
    add2(a: Matrix4, b: Matrix4): this;
    /**
     * Returns a copy of this Matrix4 instance.
     */
    clone(): Matrix4;
    /**
     * Sets this matrix to perform the specified scaling, rotation, and translation.
     */
    compose(S: VectorE3, R: SpinorE3, T: VectorE3): this;
    /**
     * Copies the specified matrix into this matrix.
     */
    copy(m: Matrix4): this;
    /**
     * Computes the determinant.
     */
    det(): number;
    /**
     * Sets the elements of this matrix to that of its inverse.
     */
    inv(): this;
    /**
     * Sets this matrix to the identity element for multiplication, <b>1</b>.
     */
    one(): this;
    /**
     * Multiplies all elements of this matrix by the specified value.
     */
    scale(s: number): this;
    /**
     * Sets this matrix to its transpose.
     */
    transpose(): this;
    /**
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param near
     * @param far
     */
    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
    /**
     * Sets this matrix to the viewing transformation.
     * This is the matrix that may be applied to points in the truncated viewing pyramid.
     * The resulting points then lie in the image space (cube).
     */
    perspective(fov: number, aspect: number, near: number, far: number): this;
    /**
     * @param axis
     * @param angle
     */
    rotationAxis(axis: VectorE3, angle: number): this;
    /**
     *
     */
    mul(rhs: Matrix4): this;
    /**
     *
     */
    mul2(a: Matrix4, b: Matrix4): this;
    /**
     *
     */
    rmul(lhs: Matrix4): this;
    /**
     * Sets this matrix to the transformation for a
     * reflection in the plane normal to the unit vector <code>n</code>.
     *
     * this ⟼ reflection(n)
     *
     * @param n
     */
    reflection(n: VectorE3): this;
    /**
     * this ⟼ rotation(spinor) * this
     *
     * @param spinor
     */
    rotate(spinor: SpinorE3): this;
    /**
     * Sets this matrix to be equivalent to the spinor.
     *
     * this ⟼ rotation(spinor)
     *
     * @param attitude  The spinor from which the rotation will be computed.
     */
    rotation(spinor: SpinorE3): this;
    /**
     * @param i the zero-based index of the row.
     */
    row(i: number): Array<number>;
    /**
     *
     */
    scaleXYZ(scale: VectorE3): this;
    /**
     *
     */
    scaling(scale: VectorE3): this;
    /**
     *
     */
    set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number, n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number): this;
    /**
     *
     */
    toExponential(fractionDigits?: number): string;
    /**
     *
     */
    toFixed(fractionDigits?: number): string;
    /**
     *
     */
    toPrecision(fractionDigits?: number): string;
    /**
     *
     */
    toString(radix?: number): string;
    /**
     * this ⟼ translation(spinor) * this
     */
    translate(d: VectorE3): this;
    /**
     * Sets this matrix to be equivalent to the displacement vector argument.
     */
    translation(displacement: VectorE3): this;
    /**
     * Sets this matrix to the identity element for addition, 0.
     */
    zero(): this;
    __mul__(rhs: Matrix4 | number): Matrix4;
    __rmul__(lhs: Matrix4 | number): Matrix4;
}
