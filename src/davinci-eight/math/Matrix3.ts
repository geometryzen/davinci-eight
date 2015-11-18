import AbstractMatrix = require('../math/AbstractMatrix')
import det3x3 = require('../math/det3x3')
import expectArg = require('../checks/expectArg')
import inv3x3 = require('../math/inv3x3')
import isDefined = require('../checks/isDefined')
import Matrix = require('../math/Matrix')
import Matrix4 = require('./Matrix4')
import mul3x3 = require('../math/mul3x3')
import mustBeNumber = require('../checks/mustBeNumber')
import Ring = require('../math/MutableRingElement')
import RingOperators = require('../math/RingOperators')
import SpinorE3 = require('../math/SpinorE3')
import VectorE3 = require('../math/VectorE3')

/**
 * @class Matrix3
 * @extends AbstractMatrix
 */
class Matrix3 extends AbstractMatrix<Matrix3> implements Matrix<Matrix3, VectorE3>, Ring<Matrix3>, RingOperators<Matrix3> {
    /**
     * 3x3 (square) matrix of numbers.
     * Constructs a Matrix3 by wrapping a Float32Array.
     * The elements are stored in column-major order:
     * 0 3 6
     * 1 4 7
     * 2 5 8
     *
     * @class Matrix3
     * @constructor
     */
    constructor(elements: Float32Array) {
        super(elements, 3);
    }

    /**
     * @method add
     * @param rhs {Matrix3}
     * @return {Matrix3}
     */
    add(rhs: Matrix3): Matrix3 {
        return this
    }

    /**
     * Returns a copy of this Matrix3 instance.
     * @method clone
     * @return {Matrix3}
     * @chainable
     */
    clone(): Matrix3 {
        return Matrix3.zero().copy(this)
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
     * @param matrix {Matrix4}
     * @return {Matrix3}
     * @deprecated
     * @private
     */
    getInverse(matrix: Matrix4, throwOnInvertible?: boolean): Matrix3 {

        // input: Matrix4
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

            var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";

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
     * @return {Matrix3}
     * @chainable
     */
    inv(): Matrix3 {
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
     * @param rhs {Matrix3}
     * @return {Matrix3}
     * @chainable
     */
    mul(rhs: Matrix3): Matrix3 {
        return this.mul2(this, rhs)
    }

    /**
     * @method mul2
     * @param a {Matrix3}
     * @param b {Matrix3}
     * @return {Matrix3}
     * @chainable
     */
    mul2(a: Matrix3, b: Matrix3): Matrix3 {
        mul3x3(a.elements, b.elements, this.elements)
        return this
    }

    /**
     * @method neg
     * @return {Matrix3}
     * @chainable
     */
    neg(): Matrix3 {
        return this.scale(-1)
    }

    /**
     * @method normalFromMatrix4
     * @param m {Matrix4}
     * @return {Matrix3}
     * @deprecated
     * @private
     */
    normalFromMatrix4(m: Matrix4): Matrix3 {
        return this.getInverse(m).transpose();
    }

    /**
     * @method one
     * @return {Matrix3}
     * @chainable
     */
    one(): Matrix3 {
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
     * @return {Matrix3}
     * @chainable
     */
    reflection(n: VectorE3): Matrix3 {

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
     * @return {Matrix3}
     */
    scale(s: number): Matrix3 {
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
     * @return {Matrix3}
     * @chainable
     */
    set(n11: number, n12: number, n13: number,
        n21: number, n22: number, n23: number,
        n31: number, n32: number, n33: number): Matrix3 {

        var te = this.elements;

        te[0] = n11; te[3] = n12; te[6] = n13;
        te[1] = n21; te[4] = n22; te[7] = n23;
        te[2] = n31; te[5] = n32; te[8] = n33;

        return this;
    }

    /**
     * @method sub
     * @param rhs {Matrix3}
     * @return {Matrix3}
     */
    sub(rhs: Matrix3): Matrix3 {
        return this
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
     * @return {Matrix3}
     */
    transpose(): Matrix3 {
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
     * @return {Matrix3}
     * @chainable
     */
    zero(): Matrix3 {
        return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    __add__(rhs: any): Matrix3 {
        if (rhs instanceof Matrix3) {
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

    __radd__(lhs: any): Matrix3 {
        if (lhs instanceof Matrix3) {
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

    __mul__(rhs: any): Matrix3 {
        if (rhs instanceof Matrix3) {
            return this.clone().mul(rhs)
        }
        else if (typeof rhs === 'number') {
            return this.clone().scale(rhs);
        }
        else {
            return void 0
        }
    }

    __rmul__(lhs: any): Matrix3 {
        if (lhs instanceof Matrix3) {
            return lhs.clone().mul(this)
        }
        else if (typeof lhs === 'number') {
            return this.clone().scale(lhs);
        }
        else {
            return void 0
        }
    }

    __pos__(): Matrix3 {
        return this.clone()
    }

    __neg__(): Matrix3 {
        return this.clone().scale(-1)
    }

    __sub__(rhs: any): Matrix3 {
        if (rhs instanceof Matrix3) {
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

    __rsub__(lhs: any): Matrix3 {
        if (lhs instanceof Matrix3) {
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
     * @return {Matrix3}
     * @static
     */
    public static one() {
        return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
    }

    /**
     * <p>
     * Creates a new matrix with all elements zero.
     * </p>
     * @method zero
     * @return {Matrix3}
     * @static
     */
    public static zero(): Matrix3 {
        return new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]));
    }
}

export = Matrix3;
