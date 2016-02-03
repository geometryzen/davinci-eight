import AbstractMatrix from '../math/AbstractMatrix';
import add2x2 from '../math/add2x2';
import det2x2 from '../math/det2x2';
import isDefined from '../checks/isDefined';
import Matrix from '../math/Matrix';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import Ring from '../math/MutableRingElement';
import RingOperators from '../math/RingOperators';
import VectorE1 from '../math/VectorE1';
import VectorE2 from '../math/VectorE2';

/**
 * @class Mat2R
 * @extends AbstractMatrix
 */
export default class Mat2R extends AbstractMatrix<Mat2R> implements Matrix<Mat2R, VectorE2, VectorE1>, Ring<Mat2R>, RingOperators<Mat2R> {

    /**
     * 2x2 (square) matrix of numbers.
     * Constructs a Mat2R by wrapping a Float32Array.
     * The elements are stored in column-major order:
     * 0 2
     * 1 3
     *
     * @class Mat2R
     * @constructor
     * @param elements {Float32Array} The elements of the matrix in column-major order.
     */
    constructor(elements: Float32Array) {
        super(elements, 2);
    }

    /**
     * @method add
     * @param rhs {Mat2R}
     * @return {Mat2R}
     * @chainable
     */
    add(rhs: Mat2R): Mat2R {
        return this.add2(this, rhs);
    }

    /**
     * @method add2
     * @param a {Mat2R}
     * @param b {Mat2R}
     * @return {Mat2R}
     * @chainable
     */
    add2(a: Mat2R, b: Mat2R): Mat2R {
        add2x2(a.elements, b.elements, this.elements)
        return this
    }

    clone(): Mat2R {
        let te = this.elements;
        let m11 = te[0];
        let m21 = te[1];
        let m12 = te[2];
        let m22 = te[3];
        return Mat2R.zero().set(m11, m12, m21, m22)
    }

    /**
     * Computes the determinant.
     * @method det
     * @return {number}
     */
    det(): number {
        return det2x2(this.elements)
    }

    /**
     * @method inv
     * @return {Mat2R}
     * @chainable
     */
    inv(): Mat2R {
        let te = this.elements;
        let a = te[0];
        let c = te[1];
        let b = te[2];
        let d = te[3];
        let det = this.det()
        return this.set(d, -b, -c, a).scale(1 / det)
    }

    /**
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean {
        let te = this.elements;
        let a = te[0];
        let c = te[1];
        let b = te[2];
        let d = te[3];
        return (a === 1 && b === 0 && c === 0 && d === 1)
    }

    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean {
        let te = this.elements;
        let a = te[0];
        let c = te[1];
        let b = te[2];
        let d = te[3];
        return (a === 0 && b === 0 && c === 0 && d === 0)
    }

    /**
     * @method mul
     * @param rhs {Mat2R}
     * @return {Mat2R}
     * @chainable
     */
    mul(rhs: Mat2R): Mat2R {
        return this.mul2(this, rhs);
    }

    /**
     * @method mul2
     * @param a {Mat2R}
     * @param b {Mat2R}
     * @return {Mat2R}
     * @chainable
     */
    mul2(a: Mat2R, b: Mat2R): Mat2R {
        let ae = a.elements;
        let a11 = ae[0];
        let a21 = ae[1];
        let a12 = ae[2];
        let a22 = ae[3];

        let be = b.elements;
        let b11 = be[0];
        let b21 = be[1];
        let b12 = be[2];
        let b22 = be[3];

        let m11 = a11 * b11 + a12 * b21;
        let m12 = a11 * b12 + a12 * b22;
        let m21 = a21 * b11 + a22 * b21;
        let m22 = a21 * b12 + a22 * b22;
        return this.set(m11, m12, m21, m22)
    }

    /**
     * @method neg
     * @return {Mat2R}
     * @chainable
     */
    neg(): Mat2R {
        return this.scale(-1)
    }

    /**
     * Sets this matrix to the identity element for multiplication, <b>1</b>.
     * @method one
     * @return {Mat2R}
     * @chainable
     */
    one(): Mat2R {
        return this.set(1, 0, 0, 1)
    }

    /**
     * Sets this matrix to the transformation for a
     * reflection in the line normal to the unit vector <code>n</code>.
     * <p>
     * this ⟼ reflection(<b>n</b>) = I - 2 * <b>n</b><sup>T</sup> * <b>n</b>
     * </p>
     * @method reflection
     * @param n {VectorE1}
     * @return {Mat2R}
     * @chainable
     */
    reflection(n: VectorE1): Mat2R {

        let nx = mustBeNumber('n.x', n.x)

        let xx = 1 - 2 * nx * nx

        return this.set(xx, 0, 0, 1)
    }

    /**
     * @method row
     * @param i {number} the zero-based index of the row.
     * @return {Array<number>}
     */
    row(i: number): Array<number> {
        let te = this.elements;
        return [te[0 + i], te[2 + i]]
    }

    /**
     * @method scale
     * @param α {number}
     * @return {Mat2R}
     * @chainable
     */
    scale(α: number): Mat2R {
        let te = this.elements;
        let m11 = te[0] * α;
        let m21 = te[1] * α;
        let m12 = te[2] * α;
        let m22 = te[3] * α;
        return this.set(m11, m12, m21, m22);
    }

    /**
     * Sets all elements of this matrix to the supplied row-major values m11, ..., m22.
     * @method set
     * @param m11 {number}
     * @param m12 {number}
     * @param m21 {number}
     * @param m22 {number}
     * @return {Mat2R}
     * @chainable
     */
    set(m11: number, m12: number, m21: number, m22: number): Mat2R {
        let te = this.elements;
        // The elements are stored in column-major order.
        te[0x0] = m11; te[0x2] = m12;
        te[0x1] = m21; te[0x3] = m22;
        return this;
    }

    /**
     * @method sub
     * @param rhs {Mat2R}
     * @return {Mat2R}
     * @chainable
     */
    sub(rhs: Mat2R): Mat2R {
        let te = this.elements;
        let t11 = te[0];
        let t21 = te[1];
        let t12 = te[2];
        let t22 = te[3];

        let re = rhs.elements;
        let r11 = re[0];
        let r21 = re[1];
        let r12 = re[2];
        let r22 = re[3];

        let m11 = t11 - r11;
        let m21 = t21 - r21;
        let m12 = t12 - r12;
        let m22 = t22 - r22;
        return this.set(m11, m12, m21, m22)
    }

    /**
     * @method toExponential
     * @return {string}
     */
    toExponential(): string {
        let text: string[] = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element: number, index: number) { return element.toExponential() }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * @method toFixed
     * @param [digits] {number}
     * @return {string}
     */
    toFixed(digits?: number): string {
        if (isDefined(digits)) {
            mustBeInteger('digits', digits)
        }
        let text: string[] = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element: number, index: number) { return element.toFixed(digits) }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * @method toString
     * @return {string}
     */
    toString(): string {
        let text: string[] = [];
        for (var i = 0, iLength = this.dimensions; i < iLength; i++) {
            text.push(this.row(i).map(function(element: number, index: number) { return element.toString() }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * @method translation
     * @param d {VectorE1}
     * @return {Mat2R}
     * @chainable
     */
    translation(d: VectorE1): Mat2R {
        let x = d.x
        return this.set(
            1, x,
            0, 1)
    }

    /**
     * Sets this matrix to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Mat2R}
     * @chainable
     */
    zero(): Mat2R {
        return this.set(0, 0, 0, 0);
    }

    __add__(rhs: any): Mat2R {
        if (rhs instanceof Mat2R) {
            return this.clone().add(rhs)
        }
        // TODO: Interpret this as I * rhs?
        //        else if (typeof rhs === 'number') {
        //            return this.clone().scale(rhs);
        //        }
        else {
            return void 0
        }
    }

    __radd__(lhs: any): Mat2R {
        if (lhs instanceof Mat2R) {
            return lhs.clone().add(this)
        }
        // TODO: Interpret this as I * rhs?
        //        else if (typeof rhs === 'number') {
        //            return this.clone().scale(rhs);
        //        }
        else {
            return void 0
        }
    }

    __mul__(rhs: any): Mat2R {
        if (rhs instanceof Mat2R) {
            return this.clone().mul(rhs)
        }
        else if (typeof rhs === 'number') {
            return this.clone().scale(rhs);
        }
        else {
            return void 0
        }
    }

    __rmul__(lhs: any): Mat2R {
        if (lhs instanceof Mat2R) {
            return lhs.clone().mul(this)
        }
        else if (typeof lhs === 'number') {
            return this.clone().scale(lhs);
        }
        else {
            return void 0
        }
    }

    __pos__(): Mat2R {
        return this.clone()
    }

    __neg__(): Mat2R {
        return this.clone().scale(-1)
    }

    __sub__(rhs: any): Mat2R {
        if (rhs instanceof Mat2R) {
            return this.clone().sub(rhs)
        }
        // TODO: Interpret this as I * rhs?
        //        else if (typeof rhs === 'number') {
        //            return this.clone().scale(rhs);
        //        }
        else {
            return void 0
        }
    }

    __rsub__(lhs: any): Mat2R {
        if (lhs instanceof Mat2R) {
            return lhs.clone().sub(this)
        }
        else {
            return void 0
        }
    }

    /**
     * <p>
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     * </p>
     * @method one
     * @return {Mat2R}
     * @static
     * @chainable
     */
    public static one(): Mat2R {
        return new Mat2R(new Float32Array([1, 0, 0, 1]));
    }

    /**
     * @method reflection
     * @param n {VectorE1}
     * @return {Mat2R}
     * @static
     * @chainable
     */
    public static reflection(n: VectorE1): Mat2R {
        return Mat2R.zero().reflection(n)
    }

    /**
     * <p>
     * Creates a new matrix with all elements zero.
     * </p>
     * @method zero
     * @return {Mat2R}
     * @static
     * @chainable
     */
    public static zero(): Mat2R {
        return new Mat2R(new Float32Array([0, 0, 0, 0]))
    }
}
