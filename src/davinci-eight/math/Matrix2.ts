import AbstractMatrix = require('../math/AbstractMatrix')
import det2x2 = require('../math/det2x2')
import GeometricElement = require('../math/GeometricElement')
import isDefined = require('../checks/isDefined')
import Matrix = require('../math/Matrix')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeNumber = require('../checks/mustBeNumber')
import Ring = require('../math/MutableRingElement')
import RingOperators = require('../math/RingOperators')
import SpinorE2 = require('../math/SpinorE2')
import VectorE2 = require('../math/VectorE2')

/**
 * @class Matrix2
 * @extends AbstractMatrix
 */
class Matrix2 extends AbstractMatrix<Matrix2> implements Matrix<Matrix2, VectorE2>, Ring<Matrix2>, RingOperators<Matrix2> {

    /**
     * 2x2 (square) matrix of numbers.
     * Constructs a Matrix2 by wrapping a Float32Array.
     * The elements are stored in column-major order:
     * 0 2
     * 1 3
     *
     * @class Matrix2
     * @constructor
     * @param elements {Float32Array} The elements of the matrix in column-major order.
     */
    constructor(elements: Float32Array) {
        super(elements, 2);
    }

    /**
     * <p>
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     * </p>
     * @method one
     * @return {Matrix2}
     * @static
     */
    public static one(): Matrix2 {
        return new Matrix2(new Float32Array([1, 0, 0, 1]));
    }

    /**
     * <p>
     * Creates a new matrix with all elements zero.
     * </p>
     * @method zero
     * @return {Matrix2}
     * @static
     */
    public static zero(): Matrix2 {
        return new Matrix2(new Float32Array([0, 0, 0, 0]))
    }

    /**
     * @method add
     * @param rhs {Matrix2}
     * @return {Matrix2}
     * @chainable
     */
    add(rhs: Matrix2): Matrix2 {
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

        let m11 = t11 + r11;
        let m21 = t21 + r21;
        let m12 = t12 + r12;
        let m22 = t22 + r22;
        return this.set(m11, m12, m21, m22)
    }

    clone(): Matrix2 {
        let te = this.elements;
        let m11 = te[0];
        let m21 = te[1];
        let m12 = te[2];
        let m22 = te[3];
        return Matrix2.zero().set(m11, m12, m21, m22)
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
     * @return {Matrix2}
     * @chainable
     */
    inv(): Matrix2 {
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
     * @param rhs {Matrix2}
     * @return {Matrix2}
     * @chainable
     */
    mul(rhs: Matrix2): Matrix2 {
        return this.mul2(this, rhs);
    }

    /**
     * @method mul2
     * @param a {Matrix2}
     * @param b {Matrix2}
     * @return {Matrix2}
     * @chainable
     */
    mul2(a: Matrix2, b: Matrix2): Matrix2 {
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
     * @return {Matrix2}
     * @chainable
     */
    neg(): Matrix2 {
        return this.scale(-1)
    }

    /**
     * Sets this matrix to the identity element for multiplication, <b>1</b>.
     * @method one
     * @return {Matrix2}
     * @chainable
     */
    one(): Matrix2 {
        return this.set(1, 0, 0, 1)
    }

    /**
     * Sets this matrix to the transformation for a
     * reflection in the line normal to the unit vector <code>n</code>.
     * <p>
     * <code>this ⟼ reflection(n)</code>
     * </p>
     * @method reflection
     * @param n {VectorE2}
     * @return {Matrix2}
     * @chainable
     */
    reflection(n: VectorE2): Matrix2 {

        let nx = mustBeNumber('n.x', n.x);
        let ny = mustBeNumber('n.y', n.y);

        let aa = -2 * nx * ny

        let xx = 1 - 2 * nx * nx
        let yy = 1 - 2 * ny * ny

        return this.set(xx, aa, aa, yy)
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
     * @return {Matrix2}
     * @chainable
     */
    scale(α: number): Matrix2 {
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
     * @return {Matrix2}
     * @chainable
     */
    set(m11: number, m12: number, m21: number, m22: number): Matrix2 {
        let te = this.elements;
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
     * Sets this matrix to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Matrix2}
     * @chainable
     */
    zero(): Matrix2 {
        return this.set(0, 0, 0, 0);
    }

    __add__(rhs: any): Matrix2 {
        if (rhs instanceof Matrix2) {
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

    __radd__(lhs: any): Matrix2 {
        if (lhs instanceof Matrix2) {
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

    __mul__(rhs: any): Matrix2 {
        if (rhs instanceof Matrix2) {
            return this.clone().mul(rhs)
        }
        else if (typeof rhs === 'number') {
            return this.clone().scale(rhs);
        }
        else {
            return void 0
        }
    }

    __rmul__(lhs: any): Matrix2 {
        if (lhs instanceof Matrix2) {
            return lhs.clone().mul(this)
        }
        else if (typeof lhs === 'number') {
            return this.clone().scale(lhs);
        }
        else {
            return void 0
        }
    }

    __pos__(): Matrix2 {
        return this.clone()
    }

    __neg__(): Matrix2 {
        return this.clone().scale(-1)
    }

    __sub__(rhs: any): Matrix2 {
        if (rhs instanceof Matrix2) {
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

    __rsub__(lhs: any): Matrix2 {
        if (lhs instanceof Matrix2) {
            return lhs.clone().sub(this)
        }
        else {
            return void 0
        }
    }
}

export = Matrix2;
