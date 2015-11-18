var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/AbstractMatrix', '../math/det3x3', '../math/inv3x3', '../math/mul3x3', '../checks/mustBeNumber'], function (require, exports, AbstractMatrix, det3x3, inv3x3, mul3x3, mustBeNumber) {
    /**
     * @class Matrix3
     * @extends AbstractMatrix
     */
    var Matrix3 = (function (_super) {
        __extends(Matrix3, _super);
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
        function Matrix3(elements) {
            _super.call(this, elements, 3);
        }
        /**
         * @method add
         * @param rhs {Matrix3}
         * @return {Matrix3}
         */
        Matrix3.prototype.add = function (rhs) {
            return this;
        };
        /**
         * Returns a copy of this Matrix3 instance.
         * @method clone
         * @return {Matrix3}
         * @chainable
         */
        Matrix3.prototype.clone = function () {
            return Matrix3.zero().copy(this);
        };
        /**
         * Computes the determinant.
         * @method det
         * @return {number}
         */
        Matrix3.prototype.det = function () {
            return det3x3(this.elements);
        };
        /**
         * @method getInverse
         * @param matrix {Matrix4}
         * @return {Matrix3}
         * @deprecated
         * @private
         */
        Matrix3.prototype.getInverse = function (matrix, throwOnInvertible) {
            // input: Matrix4
            // ( based on http://code.google.com/p/webgl-mjs/ )
            var me = matrix.elements;
            var te = this.elements;
            te[0] = me[10] * me[5] - me[6] * me[9];
            te[1] = -me[10] * me[1] + me[2] * me[9];
            te[2] = me[6] * me[1] - me[2] * me[5];
            te[3] = -me[10] * me[4] + me[6] * me[8];
            te[4] = me[10] * me[0] - me[2] * me[8];
            te[5] = -me[6] * me[0] + me[2] * me[4];
            te[6] = me[9] * me[4] - me[5] * me[8];
            te[7] = -me[9] * me[0] + me[1] * me[8];
            te[8] = me[5] * me[0] - me[1] * me[4];
            var det = me[0] * te[0] + me[1] * te[3] + me[2] * te[6];
            // no inverse
            if (det === 0) {
                var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";
                if (throwOnInvertible || !throwOnInvertible) {
                    throw new Error(msg);
                }
                else {
                    console.warn(msg);
                }
                this.one();
                return this;
            }
            this.scale(1.0 / det);
            return this;
        };
        /**
         * @method inv
         * @return {Matrix3}
         * @chainable
         */
        Matrix3.prototype.inv = function () {
            inv3x3(this.elements, this.elements);
            return this;
        };
        /**
         * @method isOne
         * @return {boolean}
         */
        Matrix3.prototype.isOne = function () {
            var te = this.elements;
            var m11 = te[0x0], m12 = te[0x3], m13 = te[0x6];
            var m21 = te[0x1], m22 = te[0x4], m23 = te[0x7];
            var m31 = te[0x2], m32 = te[0x5], m33 = te[0x8];
            return (m11 === 1 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 1 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 1);
        };
        /**
         * @method isZero
         * @return {boolean}
         */
        Matrix3.prototype.isZero = function () {
            var te = this.elements;
            var m11 = te[0x0], m12 = te[0x3], m13 = te[0x6];
            var m21 = te[0x1], m22 = te[0x4], m23 = te[0x7];
            var m31 = te[0x2], m32 = te[0x5], m33 = te[0x8];
            return (m11 === 0 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 0 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 0);
        };
        /**
         * @method mul
         * @param rhs {Matrix3}
         * @return {Matrix3}
         * @chainable
         */
        Matrix3.prototype.mul = function (rhs) {
            return this.mul2(this, rhs);
        };
        /**
         * @method mul2
         * @param a {Matrix3}
         * @param b {Matrix3}
         * @return {Matrix3}
         * @chainable
         */
        Matrix3.prototype.mul2 = function (a, b) {
            mul3x3(a.elements, b.elements, this.elements);
            return this;
        };
        /**
         * @method neg
         * @return {Matrix3}
         * @chainable
         */
        Matrix3.prototype.neg = function () {
            return this.scale(-1);
        };
        /**
         * @method normalFromMatrix4
         * @param m {Matrix4}
         * @return {Matrix3}
         * @deprecated
         * @private
         */
        Matrix3.prototype.normalFromMatrix4 = function (m) {
            return this.getInverse(m).transpose();
        };
        /**
         * @method one
         * @return {Matrix3}
         * @chainable
         */
        Matrix3.prototype.one = function () {
            return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        };
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
        Matrix3.prototype.reflection = function (n) {
            var nx = mustBeNumber('n.x', n.x);
            var ny = mustBeNumber('n.y', n.y);
            var nz = mustBeNumber('n.z', n.z);
            var aa = -2 * nx * ny;
            var cc = -2 * ny * nz;
            var bb = -2 * nz * nx;
            var xx = 1 - 2 * nx * nx;
            var yy = 1 - 2 * ny * ny;
            var zz = 1 - 2 * nz * nz;
            this.set(xx, aa, bb, aa, yy, cc, bb, cc, zz);
            return this;
        };
        /**
         * @method row
         * @param i {number} the zero-based index of the row.
         * @return {number[]}
         */
        Matrix3.prototype.row = function (i) {
            var te = this.elements;
            return [te[0 + i], te[3 + i], te[6 + i]];
        };
        /**
         * @method scale
         * @param s {number}
         * @return {Matrix3}
         */
        Matrix3.prototype.scale = function (s) {
            var m = this.elements;
            m[0] *= s;
            m[3] *= s;
            m[6] *= s;
            m[1] *= s;
            m[4] *= s;
            m[7] *= s;
            m[2] *= s;
            m[5] *= s;
            m[8] *= s;
            return this;
        };
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
        Matrix3.prototype.set = function (n11, n12, n13, n21, n22, n23, n31, n32, n33) {
            var te = this.elements;
            te[0] = n11;
            te[3] = n12;
            te[6] = n13;
            te[1] = n21;
            te[4] = n22;
            te[7] = n23;
            te[2] = n31;
            te[5] = n32;
            te[8] = n33;
            return this;
        };
        /**
         * @method sub
         * @param rhs {Matrix3}
         * @return {Matrix3}
         */
        Matrix3.prototype.sub = function (rhs) {
            return this;
        };
        /**
         * @method toString
         * @return {string}
         */
        Matrix3.prototype.toString = function () {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toString(); }).join(' '));
            }
            return text.join('\n');
        };
        /**
         * @method transpose
         * @return {Matrix3}
         */
        Matrix3.prototype.transpose = function () {
            var tmp;
            var m = this.elements;
            tmp = m[1];
            m[1] = m[3];
            m[3] = tmp;
            tmp = m[2];
            m[2] = m[6];
            m[6] = tmp;
            tmp = m[5];
            m[5] = m[7];
            m[7] = tmp;
            return this;
        };
        /**
         * Sets this matrix to the identity element for addition, <b>0</b>.
         * @method zero
         * @return {Matrix3}
         * @chainable
         */
        Matrix3.prototype.zero = function () {
            return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
        };
        Matrix3.prototype.__add__ = function (rhs) {
            if (rhs instanceof Matrix3) {
                return this.clone().add(rhs);
            }
            else {
                return void 0;
            }
        };
        Matrix3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Matrix3) {
                return lhs.clone().add(this);
            }
            else {
                return void 0;
            }
        };
        Matrix3.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Matrix3) {
                return this.clone().mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.clone().scale(rhs);
            }
            else {
                return void 0;
            }
        };
        Matrix3.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Matrix3) {
                return lhs.clone().mul(this);
            }
            else if (typeof lhs === 'number') {
                return this.clone().scale(lhs);
            }
            else {
                return void 0;
            }
        };
        Matrix3.prototype.__pos__ = function () {
            return this.clone();
        };
        Matrix3.prototype.__neg__ = function () {
            return this.clone().scale(-1);
        };
        Matrix3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Matrix3) {
                return this.clone().sub(rhs);
            }
            else {
                return void 0;
            }
        };
        Matrix3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Matrix3) {
                return lhs.clone().sub(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * <p>
         * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
         * </p>
         * @method one
         * @return {Matrix3}
         * @static
         */
        Matrix3.one = function () {
            return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
        };
        /**
         * <p>
         * Creates a new matrix with all elements zero.
         * </p>
         * @method zero
         * @return {Matrix3}
         * @static
         */
        Matrix3.zero = function () {
            return new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]));
        };
        return Matrix3;
    })(AbstractMatrix);
    return Matrix3;
});
