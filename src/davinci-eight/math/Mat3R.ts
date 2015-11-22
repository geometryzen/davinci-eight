import AbstractMatrix = require('../math/AbstractMatrix')
import det3x3 = require('../math/det3x3')
import expectArg = require('../checks/expectArg')
import inv3x3 = require('../math/inv3x3')
import isDefined = require('../checks/isDefined')
import Matrix = require('../math/Matrix')
import Mat4R = require('./Mat4R')
import mul3x3 = require('../math/mul3x3')
import mustBeNumber = require('../checks/mustBeNumber')
import Ring = require('../math/MutableRingElement')
import RingOperators = require('../math/RingOperators')
import SpinorE3 = require('../math/SpinorE3')
import VectorE3 = require('../math/VectorE3')

/**
 * @class Mat3R
 * @extends AbstractMatrix
 */
class Mat3R extends AbstractMatrix<Mat3R> implements Matrix<Mat3R, VectorE3>, Ring<Mat3R>, RingOperators<Mat3R> {
    /**
     * 3x3 (square) matrix of numbers.
     * Constructs a Mat3R by wrapping a Float32Array.
     * The elements are stored in column-major order:
     * 0 3 6
     * 1 4 7
     * 2 5 8
     *
     * @class Mat3R
     * @constructor
     */
    constructor(elements: Float32Array) {
        super(elements, 3);
    }

    /**
     * @method add
     * @param rhs {Mat3R}
     * @return {Mat3R}
     */
    add(rhs: Mat3R): Mat3R {
        let te = this.elements;
        let t11 = te[0];
        let t21 = te[1];
        let t31 = te[2];
        let t12 = te[3];
        let t22 = te[4];
        let t32 = te[5];
        let t13 = te[6];
        let t23 = te[7];
        let t33 = te[5];

        let re = rhs.elements;
        let r11 = re[0];
        let r21 = re[1];
        let r31 = re[2];
        let r12 = re[3];
        let r22 = re[4];
        let r32 = re[5];
        let r13 = re[6];
        let r23 = re[7];
        let r33 = re[8];

        let m11 = t11 + r11;
        let m21 = t21 + r21;
        let m31 = t31 + r31;
        let m12 = t12 + r12;
        let m22 = t22 + r22;
        let m32 = t32 + r32;
        let m13 = t13 + r13;
        let m23 = t23 + r23;
        let m33 = t33 + r33;
        return this.set(m11, m12, m13, m21, m22, m23, m31, m32, m33)
    }

    /**
     * Returns a copy of this Mat3R instance.
     * @method clone
     * @return {Mat3R}
     * @chainable
     */
    clone(): Mat3R {
        return Mat3R.zero().copy(this)
    }

    /**
     * Computes the determinant.
     * @method det
     * @return {number}
     */
    det(): number {
        return det3x3(this.elements)
    }

    /**
     * @method getInverse
     * @param matrix {Mat4R}
     * @return {Mat3R}
     * @deprecated
     * @private
     */
    getInverse(matrix: Mat4R, throwOnInvertible?: boolean): Mat3R {

        // input: Mat4R
        // ( based on http://code.google.com/p/webgl-mjs/ )

        var me = matrix.elements;
        var te = this.elements;

        te[0] = me[10] * me[5] - me[6] * me[9];
        te[1] = - me[10] * me[1] + me[2] * me[9];
        te[2] = me[6] * me[1] - me[2] * me[5];
        te[3] = - me[10] * me[4] + me[6] * me[8];
        te[4] = me[10] * me[0] - me[2] * me[8];
        te[5] = - me[6] * me[0] + me[2] * me[4];
        te[6] = me[9] * me[4] - me[5] * me[8];
        te[7] = - me[9] * me[0] + me[1] * me[8];
        te[8] = me[5] * me[0] - me[1] * me[4];

        var det = me[0] * te[0] + me[1] * te[3] + me[2] * te[6];

        // no inverse

        if (det === 0) {

            var msg = "Mat3R.getInverse(): can't invert matrix, determinant is 0";

            if (throwOnInvertible || !throwOnInvertible) {

                throw new Error(msg);

            } else {

                console.warn(msg);

            }

            this.one();

            return this;

        }

        this.scale(1.0 / det);

        return this;

    }

    /**
     * @method inv
     * @return {Mat3R}
     * @chainable
     */
    inv(): Mat3R {
        inv3x3(this.elements, this.elements)
        return this
    }

    /**
     * @method isOne
     * @return {boolean}
     */
    isOne(): boolean {
        let te = this.elements;
        let m11 = te[0x0], m12 = te[0x3], m13 = te[0x6];
        let m21 = te[0x1], m22 = te[0x4], m23 = te[0x7];
        let m31 = te[0x2], m32 = te[0x5], m33 = te[0x8];
        return (m11 === 1 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 1 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 1)
    }

    /**
     * @method isZero
     * @return {boolean}
     */
    isZero(): boolean {
        let te = this.elements;
        let m11 = te[0x0], m12 = te[0x3], m13 = te[0x6];
        let m21 = te[0x1], m22 = te[0x4], m23 = te[0x7];
        let m31 = te[0x2], m32 = te[0x5], m33 = te[0x8];
        return (m11 === 0 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 0 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 0)
    }

    /**
     * @method mul
     * @param rhs {Mat3R}
     * @return {Mat3R}
     * @chainable
     */
    mul(rhs: Mat3R): Mat3R {
        return this.mul2(this, rhs)
    }

    /**
     * @method mul2
     * @param a {Mat3R}
     * @param b {Mat3R}
     * @return {Mat3R}
     * @chainable
     */
    mul2(a: Mat3R, b: Mat3R): Mat3R {
        mul3x3(a.elements, b.elements, this.elements)
        return this
    }

    /**
     * @method neg
     * @return {Mat3R}
     * @chainable
     */
    neg(): Mat3R {
        return this.scale(-1)
    }

    /**
     * @method normalFromMat4R
     * @param m {Mat4R}
     * @return {Mat3R}
     * @deprecated
     * @private
     */
    normalFromMat4R(m: Mat4R): Mat3R {
        return this.getInverse(m).transpose();
    }

    /**
     * @method one
     * @return {Mat3R}
     * @chainable
     */
    one(): Mat3R {
        return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    /**
     * Sets this matrix to the transformation for a
     * reflection in the plane normal to the unit vector <code>n</code>.
     * <p>
     * <code>this ⟼ reflection(n)</code>
     * </p>
     * @method reflection
     * @param n {VectorE3}
     * @return {Mat3R}
     * @chainable
     */
    reflection(n: VectorE3): Mat3R {

        let nx = mustBeNumber('n.x', n.x);
        let ny = mustBeNumber('n.y', n.y);
        let nz = mustBeNumber('n.z', n.z);

        let aa = -2 * nx * ny;
        let cc = -2 * ny * nz;
        let bb = -2 * nz * nx;

        let xx = 1 - 2 * nx * nx;
        let yy = 1 - 2 * ny * ny;
        let zz = 1 - 2 * nz * nz;

        this.set(
            xx, aa, bb,
            aa, yy, cc,
            bb, cc, zz
        );
        return this;
    }

    /**
     * @method row
     * @param i {number} the zero-based index of the row.
     * @return {number[]}
     */
    row(i: number): number[] {
        let te = this.elements
        return [te[0 + i], te[3 + i], te[6 + i]]
    }

    /**
     * @method scale
     * @param s {number}
     * @return {Mat3R}
     */
    scale(s: number): Mat3R {
        let m = this.elements;
        m[0] *= s; m[3] *= s; m[6] *= s;
        m[1] *= s; m[4] *= s; m[7] *= s;
        m[2] *= s; m[5] *= s; m[8] *= s;
        return this;
    }

    /**
     * Sets all elements of this matrix to the supplied row-major values.
     * @method set
     * @param m11 {number}
     * @param m12 {number}
     * @param m13 {number}
     * @param m21 {number}
     * @param m22 {number}
     * @param m23 {number}
     * @param m31 {number}
     * @param m32 {number}
     * @param m33 {number}
     * @return {Mat3R}
     * @chainable
     */
    set(n11: number, n12: number, n13: number,
        n21: number, n22: number, n23: number,
        n31: number, n32: number, n33: number): Mat3R {

        var te = this.elements;

        te[0] = n11; te[3] = n12; te[6] = n13;
        te[1] = n21; te[4] = n22; te[7] = n23;
        te[2] = n31; te[5] = n32; te[8] = n33;

        return this;
    }

    /**
     * @method sub
     * @param rhs {Mat3R}
     * @return {Mat3R}
     */
    sub(rhs: Mat3R): Mat3R {
        let te = this.elements;
        let t11 = te[0];
        let t21 = te[1];
        let t31 = te[2];
        let t12 = te[3];
        let t22 = te[4];
        let t32 = te[5];
        let t13 = te[6];
        let t23 = te[7];
        let t33 = te[5];

        let re = rhs.elements;
        let r11 = re[0];
        let r21 = re[1];
        let r31 = re[2];
        let r12 = re[3];
        let r22 = re[4];
        let r32 = re[5];
        let r13 = re[6];
        let r23 = re[7];
        let r33 = re[8];

        let m11 = t11 - r11;
        let m21 = t21 - r21;
        let m31 = t31 - r31;
        let m12 = t12 - r12;
        let m22 = t22 - r22;
        let m32 = t32 - r32;
        let m13 = t13 - r13;
        let m23 = t23 -  r23;
        let m33 = t33 -  r33;
        return this.set(m11, m12, m13, m21, m22, m23, m31, m32, m33)
    }

    /**
     * @method toString
     * @return {string}
     */
    toString(): string {
        let text: string[] = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element: number, index: number) { return element.toString() }).join(' '));
        }
        return text.join('\n');
    }

    /**
     * @method transpose
     * @return {Mat3R}
     */
    transpose(): Mat3R {
        var tmp: number;
        var m = this.elements;

        tmp = m[1]; m[1] = m[3]; m[3] = tmp;
        tmp = m[2]; m[2] = m[6]; m[6] = tmp;
        tmp = m[5]; m[5] = m[7]; m[7] = tmp;

        return this;
    }

    /**
     * Sets this matrix to the identity element for addition, <b>0</b>.
     * @method zero
     * @return {Mat3R}
     * @chainable
     */
    zero(): Mat3R {
        return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    __add__(rhs: any): Mat3R {
        if (rhs instanceof Mat3R) {
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

    __radd__(lhs: any): Mat3R {
        if (lhs instanceof Mat3R) {
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

    __mul__(rhs: any): Mat3R {
        if (rhs instanceof Mat3R) {
            return this.clone().mul(rhs)
        }
        else if (typeof rhs === 'number') {
            return this.clone().scale(rhs);
        }
        else {
            return void 0
        }
    }

    __rmul__(lhs: any): Mat3R {
        if (lhs instanceof Mat3R) {
            return lhs.clone().mul(this)
        }
        else if (typeof lhs === 'number') {
            return this.clone().scale(lhs);
        }
        else {
            return void 0
        }
    }

    __pos__(): Mat3R {
        return this.clone()
    }

    __neg__(): Mat3R {
        return this.clone().scale(-1)
    }

    __sub__(rhs: any): Mat3R {
        if (rhs instanceof Mat3R) {
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

    __rsub__(lhs: any): Mat3R {
        if (lhs instanceof Mat3R) {
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
     * @return {Mat3R}
     * @static
     */
    public static one() {
        return new Mat3R(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
    }

    /**
     * @method reflection
     * @param n {VectorE3}
     * @return {Mat3R}
     * @static
     * @chainable
     */
    public static reflection(n: VectorE3): Mat3R {
        return Mat3R.zero().reflection(n)
    }

    /**
     * <p>
     * Creates a new matrix with all elements zero.
     * </p>
     * @method zero
     * @return {Mat3R}
     * @static
     */
    public static zero(): Mat3R {
        return new Mat3R(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]));
    }
}

export = Mat3R;
