import { AbstractMatrix } from '../math/AbstractMatrix';
import { det3x3 } from '../math/det3x3';
import { inv3x3 } from '../math/inv3x3';
import { lock } from '../core/Lockable';
import { TargetLockedError } from '../core/Lockable';
import { Matrix4 } from './Matrix4';
import { mul3x3 } from '../math/mul3x3';
import { mustBeNumber } from '../checks/mustBeNumber';
import { SpinorE2 } from '../math/SpinorE2';
import { VectorE2 } from '../math/VectorE2';

function add3x3(a: Float32Array, b: Float32Array, c: Float32Array): void {

    const a11 = a[0x0], a12 = a[0x3], a13 = a[0x6];
    const a21 = a[0x1], a22 = a[0x4], a23 = a[0x7];
    const a31 = a[0x2], a32 = a[0x5], a33 = a[0x8];

    const b11 = b[0x0], b12 = b[0x3], b13 = b[0x6];
    const b21 = b[0x1], b22 = b[0x4], b23 = b[0x7];
    const b31 = b[0x2], b32 = b[0x5], b33 = b[0x8];

    c[0x0] = a11 + b11;
    c[0x3] = a12 + b12;
    c[0x6] = a13 + b13;

    c[0x1] = a21 + b21;
    c[0x4] = a22 + b22;
    c[0x7] = a23 + b23;

    c[0x2] = a31 + b31;
    c[0x5] = a32 + b32;
    c[0x8] = a33 + b33;
}

/**
 * <p>
 * A 3x3 (square) matrix of <code>number</code>s.
 * </p>
 * <p>
 * An adapter over a <code>Float32Array</code>, enabling it to be used directly with WebGL.
 * </p>
 * <p>
 * The 9 elements are stored in <em>column-major</em> order (the order expected by WebGL):
 * <table>
 * <tr><td>0</td><td>3</td><td>6</td></tr>
 * <tr><td>1</td><td>4</td><td>7</td></tr>
 * <tr><td>2</td><td>5</td><td>8</td></tr>
 * </table>
 * </p>
 */
export class Matrix3 extends AbstractMatrix<Matrix3> {

    /**
     * @param elements
     */
    constructor(elements: Float32Array) {
        super(elements, 3);
    }

    /**
     *
     */
    add(rhs: Matrix3): this {
        if (this.isLocked()) {
            throw new TargetLockedError('add');
        }
        return this.add2(this, rhs);
    }

    /**
     *
     */
    add2(a: Matrix3, b: Matrix3): this {
        add3x3(a.elements, b.elements, this.elements);
        return this;
    }

    /**
     * Returns a copy of this Matrix3 instance.
     */
    clone(): Matrix3 {
        return new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0])).copy(this);
    }

    /**
     * Computes the determinant.
     */
    det(): number {
        return det3x3(this.elements);
    }

    /**
     * <p>
     * Sets this matrix to the inverse of the upper-left 3x3 portion of a 4x4 matrix.
     * </p>
     *
     * @param matrix
     * @param throwOnSingular
     */
    private invertUpperLeft(matrix: Matrix4, throwOnSingular = false): this {

        const me = matrix.elements;
        const te = this.elements;

        // Compute the determinants of the minors.
        // This is the Laplacian development by minors.
        te[0] = me[0xA] * me[5] - me[6] * me[9];
        te[1] = - me[0xA] * me[1] + me[2] * me[9];
        te[2] = me[6] * me[1] - me[2] * me[5];
        te[3] = - me[10] * me[4] + me[6] * me[8];
        te[4] = me[10] * me[0] - me[2] * me[8];
        te[5] = - me[6] * me[0] + me[2] * me[4];
        te[6] = me[9] * me[4] - me[5] * me[8];
        te[7] = - me[9] * me[0] + me[1] * me[8];
        te[8] = me[5] * me[0] - me[1] * me[4];

        const det = me[0] * te[0] + me[1] * te[3] + me[2] * te[6];

        if (det === 0) {
            const msg = "Matrix3.invertUpperLeft(): can't invert matrix, determinant is 0";
            if (throwOnSingular) {
                // FIXME: At this point we have mutated this matrix.
                // It would be better to leave it unchanged.
                throw new Error(msg);
            }
            else {
                console.warn(msg);
                // We set to the identity matrix to minimize the damage when used in a WebGL shader.
                this.one();
            }
            return this;
        }
        else {
            this.scale(1 / det);
            return this;
        }
    }

    /**
     *
     */
    inv(): this {
        inv3x3(this.elements, this.elements);
        return this;
    }

    /**
     *
     */
    isOne(): boolean {
        let te = this.elements;
        let m11 = te[0x0], m12 = te[0x3], m13 = te[0x6];
        let m21 = te[0x1], m22 = te[0x4], m23 = te[0x7];
        let m31 = te[0x2], m32 = te[0x5], m33 = te[0x8];
        return (m11 === 1 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 1 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 1);
    }

    /**
     *
     */
    isZero(): boolean {
        let te = this.elements;
        let m11 = te[0x0], m12 = te[0x3], m13 = te[0x6];
        let m21 = te[0x1], m22 = te[0x4], m23 = te[0x7];
        let m31 = te[0x2], m32 = te[0x5], m33 = te[0x8];
        return (m11 === 0 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 0 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 0);
    }

    /**
     * @param rhs
     */
    mul(rhs: Matrix3): this {
        return this.mul2(this, rhs);
    }

    /**
     * @param lhs
     */
    rmul(lhs: Matrix3): this {
        mul3x3(lhs.elements, this.elements, this.elements);
        return this;
    }

    /**
     * @param a
     * @param b
     */
    mul2(a: Matrix3, b: Matrix3): this {
        mul3x3(a.elements, b.elements, this.elements);
        return this;
    }

    /**
     *
     */
    neg(): this {
        return this.scale(-1);
    }

    /**
     * <p>
     * Sets this 3x3 matrix to the matrix required to properly transform normal vectors
     * (pseudo or axial vectors) based upon the 4x4 matrix used to transform polar vectors.
     * </p>
     * 
     * @param m
     */
    normalFromMatrix4(m: Matrix4): this {
        return this.invertUpperLeft(m).transpose();
    }

    /**
     *
     */
    one(): this {
        return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    /**
     * <p>
     * Sets this matrix to the transformation for a
     * reflection in the plane normal to the unit vector <code>n</code>.
     * </p>
     * <p>
     * <code>this ⟼ reflection(n)</code>
     * </p>
     *
     * @param n
     */
    reflection(n: VectorE2): this {

        const nx = mustBeNumber('n.x', n.x);
        const ny = mustBeNumber('n.y', n.y);

        const aa = -2 * nx * ny;

        const xx = 1 - 2 * nx * nx;
        const yy = 1 - 2 * ny * ny;

        this.set(
            xx, aa, 0,
            aa, yy, 0,
            0, 0, 1
        );
        return this;
    }

    /**
     * @param i the zero-based index of the row.
     */
    row(i: number): number[] {
        const te = this.elements;
        return [te[0 + i], te[3 + i], te[6 + i]];
    }

    /**
     * @param spinor
     */
    rotate(spinor: SpinorE2): this {
        // TODO: This is creating a temporary.
        return this.rmul(Matrix3.rotation(spinor));
    }

    /**
     * @param spinor
     */
    rotation(spinor: SpinorE2): this {
        const α = spinor.a;
        const β = spinor.b;
        const S = α * α - β * β;
        const A = 2 * α * β;
        this.set(S, A, 0, -A, S, 0, 0, 0, 1);
        return this;
    }

    /**
     * @param s
     */
    scale(s: number): this {
        const m = this.elements;
        m[0] *= s; m[3] *= s; m[6] *= s;
        m[1] *= s; m[4] *= s; m[7] *= s;
        m[2] *= s; m[5] *= s; m[8] *= s;
        return this;
    }

    /**
     * <p>
     * Sets all elements of this matrix to the supplied values (provided in <em>row-major</em> order).
     * </p>
     * <p>
     * An advantage of this method is that the function call resembles the matrix written out.
     * </p>
     * <p>
     * The parameters are named according to the 1-based row and column.
     * </p>
     *
     * @param n11
     * @param n12
     * @param n13
     * @param n21
     * @param n22
     * @param n23
     * @param n31
     * @param n32
     * @param n33
     */
    set(n11: number, n12: number, n13: number,
        n21: number, n22: number, n23: number,
        n31: number, n32: number, n33: number): this {

        const te = this.elements;

        te[0] = n11; te[3] = n12; te[6] = n13;
        te[1] = n21; te[4] = n22; te[7] = n23;
        te[2] = n31; te[5] = n32; te[8] = n33;

        return this;
    }

    /**
     * @param rhs
     */
    sub(rhs: Matrix3): this {
        const te = this.elements;
        const t11 = te[0];
        const t21 = te[1];
        const t31 = te[2];
        const t12 = te[3];
        const t22 = te[4];
        const t32 = te[5];
        const t13 = te[6];
        const t23 = te[7];
        const t33 = te[5];

        const re = rhs.elements;
        const r11 = re[0];
        const r21 = re[1];
        const r31 = re[2];
        const r12 = re[3];
        const r22 = re[4];
        const r32 = re[5];
        const r13 = re[6];
        const r23 = re[7];
        const r33 = re[8];

        const m11 = t11 - r11;
        const m21 = t21 - r21;
        const m31 = t31 - r31;
        const m12 = t12 - r12;
        const m22 = t22 - r22;
        const m32 = t32 - r32;
        const m13 = t13 - r13;
        const m23 = t23 - r23;
        const m33 = t33 - r33;
        return this.set(m11, m12, m13, m21, m22, m23, m31, m32, m33);
    }

    /**
     * @param fractionDigits
     */
    toExponential(fractionDigits?: number): string {
        const text: string[] = [];
        for (let i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element: number, index: number) { return element.toExponential(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * @param fractionDigits
     */
    toFixed(fractionDigits?: number): string {
        const text: string[] = [];
        for (let i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element: number, index: number) { return element.toFixed(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * @param precision
     */
    toPrecision(precision?: number): string {
        const text: string[] = [];
        for (let i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element: number, index: number) { return element.toPrecision(precision); }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * @param radix
     */
    toString(radix?: number): string {
        const text: string[] = [];
        for (let i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element: number, index: number) { return element.toString(radix); }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * <p>
     * Computes the homogeneous translation matrix for a 2D translation.
     * </p>
     *
     * @param d
     */
    translation(d: VectorE2): this {
        const x = d.x;
        const y = d.y;
        return this.set(
            1, 0, x,
            0, 1, y,
            0, 0, 1);
    }

    /**
     *
     */
    transpose(): this {
        let tmp: number;
        const m = this.elements;

        tmp = m[1]; m[1] = m[3]; m[3] = tmp;
        tmp = m[2]; m[2] = m[6]; m[6] = tmp;
        tmp = m[5]; m[5] = m[7]; m[7] = tmp;

        return this;
    }

    /**
     * Sets this matrix to the identity element for addition, <b>0</b>.
     */
    zero(): this {
        return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    __add__(rhs: any): Matrix3 {
        if (rhs instanceof Matrix3) {
            return this.clone().add(rhs);
        }
        // TODO: Interpret this as I * rhs?
        //        else if (typeof rhs === 'number') {
        //            return this.clone().scale(rhs);
        //        }
        else {
            return void 0;
        }
    }

    __radd__(lhs: any): Matrix3 {
        if (lhs instanceof Matrix3) {
            return lhs.clone().add(this);
        }
        // TODO: Interpret this as I * rhs?
        //        else if (typeof rhs === 'number') {
        //            return this.clone().scale(rhs);
        //        }
        else {
            return void 0;
        }
    }

    __mul__(rhs: any): Matrix3 {
        if (rhs instanceof Matrix3) {
            return this.clone().mul(rhs);
        }
        else if (typeof rhs === 'number') {
            return this.clone().scale(rhs);
        }
        else {
            return void 0;
        }
    }

    __rmul__(lhs: any): Matrix3 {
        if (lhs instanceof Matrix3) {
            return lhs.clone().mul(this);
        }
        else if (typeof lhs === 'number') {
            return this.clone().scale(lhs);
        }
        else {
            return void 0;
        }
    }

    __pos__(): Matrix3 {
        return this.clone();
    }

    __neg__(): Matrix3 {
        return this.clone().scale(-1);
    }

    __sub__(rhs: any): Matrix3 {
        if (rhs instanceof Matrix3) {
            return this.clone().sub(rhs);
        }
        // TODO: Interpret this as I * rhs?
        //        else if (typeof rhs === 'number') {
        //            return this.clone().scale(rhs);
        //        }
        else {
            return void 0;
        }
    }

    __rsub__(lhs: any): Matrix3 {
        if (lhs instanceof Matrix3) {
            return lhs.clone().sub(this);
        }
        else {
            return void 0;
        }
    }

    /**
     * The identity matrix for multiplication.
     * The matrix is locked (immutable), but may be cloned.
     */
    static readonly one = lock(new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])));

    /**
     * @param n
     */
    public static reflection(n: VectorE2): Matrix3 {
        return Matrix3.zero.clone().reflection(n);
    }

    /**
     * @param spinor
     */
    public static rotation(spinor: SpinorE2): Matrix3 {
        return Matrix3.zero.clone().rotation(spinor);
    }

    /**
     * @param d
     */
    public static translation(d: VectorE2): Matrix3 {
        return Matrix3.zero.clone().translation(d);
    }

    /**
     * The identity matrix for addition.
     * The matrix is locked (immutable), but may be cloned.
     */
    static readonly zero = lock(new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0])));
}
