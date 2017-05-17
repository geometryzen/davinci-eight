import { AbstractMatrix } from '../math/AbstractMatrix';
import { det2x2 } from '../math/det2x2';
import { isDefined } from '../checks/isDefined';
import { lock, TargetLockedError } from '../core/Lockable';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNumber } from '../checks/mustBeNumber';
import { VectorE1 } from '../math/VectorE1';

function add2x2(a: Float32Array, b: Float32Array, c: Float32Array): void {

    const a11 = a[0x0], a12 = a[0x2];
    const a21 = a[0x1], a22 = a[0x3];

    const b11 = b[0x0], b12 = b[0x2];
    const b21 = b[0x1], b22 = b[0x3];

    c[0x0] = a11 + b11;
    c[0x2] = a12 + b12;

    c[0x1] = a21 + b21;
    c[0x3] = a22 + b22;
}

/**
 *
 */
export class Matrix2 extends AbstractMatrix<Matrix2> {

    /**
     * 2x2 (square) matrix of numbers.
     * Constructs a Matrix2 by wrapping a Float32Array.
     * The elements are stored in column-major order:
     * 0 2
     * 1 3
     *
     * @param elements The elements of the matrix in column-major order.
     */
    constructor(elements: Float32Array) {
        super(elements, 2);
    }

    add(rhs: Matrix2): Matrix2 {
        if (this.isLocked()) {
            throw new TargetLockedError('add');
        }
        return this.add2(this, rhs);
    }

    add2(a: Matrix2, b: Matrix2): Matrix2 {
        add2x2(a.elements, b.elements, this.elements);
        return this;
    }

    clone(): Matrix2 {
        const te = this.elements;
        const m11 = te[0];
        const m21 = te[1];
        const m12 = te[2];
        const m22 = te[3];
        return new Matrix2(new Float32Array([0, 0, 0, 0])).set(m11, m12, m21, m22);
    }

    /**
     * Computes the determinant.
     */
    det(): number {
        return det2x2(this.elements);
    }

    /**
     * Sets this matrix to its inverse.
     */
    inv(): Matrix2 {
        const te = this.elements;
        const a = te[0];
        const c = te[1];
        const b = te[2];
        const d = te[3];
        const det = this.det();
        return this.set(d, -b, -c, a).scale(1 / det);
    }

    /**
     * Determines whether this matrix is the identity matrix for multiplication.
     */
    isOne(): boolean {
        const te = this.elements;
        const a = te[0];
        const c = te[1];
        const b = te[2];
        const d = te[3];
        return (a === 1 && b === 0 && c === 0 && d === 1);
    }

    /**
     * Determines whether this matrix is the identity matrix for addition.
     */
    isZero(): boolean {
        const te = this.elements;
        const a = te[0];
        const c = te[1];
        const b = te[2];
        const d = te[3];
        return (a === 0 && b === 0 && c === 0 && d === 0);
    }

    mul(rhs: Matrix2): Matrix2 {
        return this.mul2(this, rhs);
    }

    mul2(a: Matrix2, b: Matrix2): Matrix2 {
        const ae = a.elements;
        const a11 = ae[0];
        const a21 = ae[1];
        const a12 = ae[2];
        const a22 = ae[3];

        const be = b.elements;
        const b11 = be[0];
        const b21 = be[1];
        const b12 = be[2];
        const b22 = be[3];

        const m11 = a11 * b11 + a12 * b21;
        const m12 = a11 * b12 + a12 * b22;
        const m21 = a21 * b11 + a22 * b21;
        const m22 = a21 * b12 + a22 * b22;
        return this.set(m11, m12, m21, m22);
    }

    /**
     * Sets this matrix to its additive inverse.
     */
    neg(): Matrix2 {
        return this.scale(-1);
    }

    /**
     * Sets this matrix to the identity element for multiplication, 1.
     */
    one(): Matrix2 {
        return this.set(1, 0, 0, 1);
    }

    /**
     * Sets this matrix to the transformation for a
     * reflection in the line normal to the unit vector <code>n</code>.
     *
     * this ⟼ reflection(<b>n</b>) = I - 2 * <b>n</b><sup>T</sup> * <b>n</b>
     *
     */
    reflection(n: VectorE1): Matrix2 {

        const nx = mustBeNumber('n.x', n.x);

        const xx = 1 - 2 * nx * nx;

        return this.set(xx, 0, 0, 1);
    }

    /**
     * Returns the row for the specified index.
     * @param i the zero-based index of the row.
     */
    row(i: number): Array<number> {
        const te = this.elements;
        return [te[0 + i], te[2 + i]];
    }

    /**
     * Multiplies this matrix by the scale factor, α.
     */
    scale(α: number): Matrix2 {
        const te = this.elements;
        const m11 = te[0] * α;
        const m21 = te[1] * α;
        const m12 = te[2] * α;
        const m22 = te[3] * α;
        return this.set(m11, m12, m21, m22);
    }

    /**
     * Sets all elements of this matrix to the supplied row-major values m11, ..., m22.
     * @method set
     * @param m11 {number}
     * @param m12 {number}
     * @param m21 {number}
     * @param m22 {number}
     * @return {Matrix2}
     * @chainable
     */
    set(m11: number, m12: number, m21: number, m22: number): Matrix2 {
        const te = this.elements;
        // The elements are stored in column-major order.
        te[0x0] = m11; te[0x2] = m12;
        te[0x1] = m21; te[0x3] = m22;
        return this;
    }

    /**
     * @method sub
     * @param rhs {Matrix2}
     * @return {Matrix2}
     * @chainable
     */
    sub(rhs: Matrix2): Matrix2 {
        const te = this.elements;
        const t11 = te[0];
        const t21 = te[1];
        const t12 = te[2];
        const t22 = te[3];

        const re = rhs.elements;
        const r11 = re[0];
        const r21 = re[1];
        const r12 = re[2];
        const r22 = re[3];

        const m11 = t11 - r11;
        const m21 = t21 - r21;
        const m12 = t12 - r12;
        const m22 = t22 - r22;
        return this.set(m11, m12, m21, m22);
    }

    /**
     * @method toExponential
     * @param [fractionDigits] {number}
     * @return {string}
     */
    toExponential(fractionDigits?: number): string {
        const text: string[] = [];
        for (let i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element: number, index: number) { return element.toExponential(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    toFixed(fractionDigits?: number): string {
        if (isDefined(fractionDigits)) {
            mustBeInteger('fractionDigits', fractionDigits);
        }
        const text: string[] = [];
        for (let i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element: number, index: number) { return element.toFixed(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * @method toPrecision
     * @param [precision] {number}
     * @return {string}
     */
    toPrecision(precision?: number): string {
        if (isDefined(precision)) {
            mustBeInteger('precision', precision);
        }
        const text: string[] = [];
        for (let i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element: number, index: number) { return element.toPrecision(precision); }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * @method toString
     * @param [radix] {number}
     * @return {string}
     */
    toString(radix?: number): string {
        const text: string[] = [];
        for (let i = 0, iLength = this.dimensions; i < iLength; i++) {
            text.push(this.row(i).map(function (element: number, index: number) { return element.toString(radix); }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * @method translation
     * @param d {VectorE1}
     * @return {Matrix2}
     * @chainable
     */
    translation(d: VectorE1): Matrix2 {
        const x = d.x;
        return this.set(
            1, x,
            0, 1);
    }

    /**
     * Sets this matrix to the identity element for addition, 0.
     */
    zero(): Matrix2 {
        return this.set(0, 0, 0, 0);
    }

    __add__(rhs: any): Matrix2 {
        if (rhs instanceof Matrix2) {
            return lock(this.clone().add(rhs));
        }
        // TODO: Interpret this as I * rhs?
        //        else if (typeof rhs === 'number') {
        //            return this.clone().scale(rhs);
        //        }
        else {
            return void 0;
        }
    }

    __radd__(lhs: any): Matrix2 {
        if (lhs instanceof Matrix2) {
            return lock(lhs.clone().add(this));
        }
        // TODO: Interpret this as I * rhs?
        //        else if (typeof rhs === 'number') {
        //            return this.clone().scale(rhs);
        //        }
        else {
            return void 0;
        }
    }

    __mul__(rhs: any): Matrix2 {
        if (rhs instanceof Matrix2) {
            return lock(this.clone().mul(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(this.clone().scale(rhs));
        }
        else {
            return void 0;
        }
    }

    __rmul__(lhs: any): Matrix2 {
        if (lhs instanceof Matrix2) {
            return lock(lhs.clone().mul(this));
        }
        else if (typeof lhs === 'number') {
            return lock(this.clone().scale(lhs));
        }
        else {
            return void 0;
        }
    }

    __pos__(): Matrix2 {
        return lock(this.clone());
    }

    __neg__(): Matrix2 {
        return lock(this.clone().scale(-1));
    }

    __sub__(rhs: any): Matrix2 {
        if (rhs instanceof Matrix2) {
            return lock(this.clone().sub(rhs));
        }
        // TODO: Interpret this as I * rhs?
        //        else if (typeof rhs === 'number') {
        //            return this.clone().scale(rhs);
        //        }
        else {
            return void 0;
        }
    }

    __rsub__(lhs: any): Matrix2 {
        if (lhs instanceof Matrix2) {
            return lock(lhs.clone().sub(this));
        }
        else {
            return void 0;
        }
    }

    static readonly one = lock(new Matrix2(new Float32Array([1, 0, 0, 1])));

    /**
     *
     */
    public static reflection(n: VectorE1): Matrix2 {
        return Matrix2.zero.clone().reflection(n);
    }

    static readonly zero = lock(new Matrix2(new Float32Array([0, 0, 0, 0])));
}
