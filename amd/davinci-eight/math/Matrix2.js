var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/AbstractMatrix', '../math/det2x2'], function (require, exports, AbstractMatrix, det2x2) {
    /**
     * @class Matrix2
     * @extends AbstractMatrix
     */
    var Matrix2 = (function (_super) {
        __extends(Matrix2, _super);
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
        function Matrix2(elements) {
            _super.call(this, elements, 2);
        }
        /**
         * <p>
         * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
         * </p>
         * @method one
         * @return {Matrix2}
         * @static
         */
        Matrix2.one = function () {
            return new Matrix2(new Float32Array([1, 0, 0, 1]));
        };
        /**
         * <p>
         * Creates a new matrix with all elements zero.
         * </p>
         * @method zero
         * @return {Matrix2}
         * @static
         */
        Matrix2.zero = function () {
            return new Matrix2(new Float32Array([0, 0, 0, 0]));
        };
        /**
         * @method add
         * @param rhs {Matrix2}
         * @return {Matrix2}
         * @chainable
         */
        Matrix2.prototype.add = function (rhs) {
            var te = this.elements;
            var t11 = te[0];
            var t21 = te[1];
            var t12 = te[2];
            var t22 = te[3];
            var re = rhs.elements;
            var r11 = re[0];
            var r21 = re[1];
            var r12 = re[2];
            var r22 = re[3];
            var m11 = t11 + r11;
            var m21 = t21 + r21;
            var m12 = t12 + r12;
            var m22 = t22 + r22;
            return this.set(m11, m12, m21, m22);
        };
        Matrix2.prototype.clone = function () {
            var te = this.elements;
            var m11 = te[0];
            var m21 = te[1];
            var m12 = te[2];
            var m22 = te[3];
            return Matrix2.zero().set(m11, m12, m21, m22);
        };
        /**
         * Computes the determinant.
         * @method det
         * @return {number}
         */
        Matrix2.prototype.det = function () {
            return det2x2(this.elements);
        };
        /**
         * @method inv
         * @return {Matrix2}
         * @chainable
         */
        Matrix2.prototype.inv = function () {
            var te = this.elements;
            var a = te[0];
            var c = te[1];
            var b = te[2];
            var d = te[3];
            var det = this.det();
            return this.set(d, -b, -c, a).scale(1 / det);
        };
        /**
         * @method isOne
         * @return {boolean}
         */
        Matrix2.prototype.isOne = function () {
            var te = this.elements;
            var a = te[0];
            var c = te[1];
            var b = te[2];
            var d = te[3];
            return (a === 1 && b === 0 && c === 0 && d === 1);
        };
        /**
         * @method isZero
         * @return {boolean}
         */
        Matrix2.prototype.isZero = function () {
            var te = this.elements;
            var a = te[0];
            var c = te[1];
            var b = te[2];
            var d = te[3];
            return (a === 0 && b === 0 && c === 0 && d === 0);
        };
        /**
         * @method mul
         * @param rhs {Matrix2}
         * @return {Matrix2}
         * @chainable
         */
        Matrix2.prototype.mul = function (rhs) {
            return this.mul2(this, rhs);
        };
        /**
         * @method mul2
         * @param a {Matrix2}
         * @param b {Matrix2}
         * @return {Matrix2}
         * @chainable
         */
        Matrix2.prototype.mul2 = function (a, b) {
            var ae = a.elements;
            var a11 = ae[0];
            var a21 = ae[1];
            var a12 = ae[2];
            var a22 = ae[3];
            var be = b.elements;
            var b11 = be[0];
            var b21 = be[1];
            var b12 = be[2];
            var b22 = be[3];
            var m11 = a11 * b11 + a12 * b21;
            var m12 = a11 * b12 + a12 * b22;
            var m21 = a21 * b11 + a22 * b21;
            var m22 = a21 * b12 + a22 * b22;
            return this.set(m11, m12, m21, m22);
        };
        /**
         * @method neg
         * @return {Matrix2}
         * @chainable
         */
        Matrix2.prototype.neg = function () {
            return this.scale(-1);
        };
        /**
         * Sets this matrix to the identity element for multiplication, <b>1</b>.
         * @method one
         * @return {Matrix2}
         * @chainable
         */
        Matrix2.prototype.one = function () {
            return this.set(1, 0, 0, 1);
        };
        /**
         * @method row
         * @param i {number} the zero-based index of the row.
         * @return {Array<number>}
         */
        Matrix2.prototype.row = function (i) {
            var te = this.elements;
            return [te[0 + i], te[2 + i]];
        };
        /**
         * @method scale
         * @param α {number}
         * @return {Matrix2}
         * @chainable
         */
        Matrix2.prototype.scale = function (α) {
            var te = this.elements;
            var m11 = te[0] * α;
            var m21 = te[1] * α;
            var m12 = te[2] * α;
            var m22 = te[3] * α;
            return this.set(m11, m12, m21, m22);
        };
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
        Matrix2.prototype.set = function (m11, m12, m21, m22) {
            var te = this.elements;
            // The elements are stored in column-major order.
            te[0x0] = m11;
            te[0x2] = m12;
            te[0x1] = m21;
            te[0x3] = m22;
            return this;
        };
        /**
         * @method sub
         * @param rhs {Matrix2}
         * @return {Matrix2}
         * @chainable
         */
        Matrix2.prototype.sub = function (rhs) {
            var te = this.elements;
            var t11 = te[0];
            var t21 = te[1];
            var t12 = te[2];
            var t22 = te[3];
            var re = rhs.elements;
            var r11 = re[0];
            var r21 = re[1];
            var r12 = re[2];
            var r22 = re[3];
            var m11 = t11 - r11;
            var m21 = t21 - r21;
            var m12 = t12 - r12;
            var m22 = t22 - r22;
            return this.set(m11, m12, m21, m22);
        };
        /**
         * @method toString
         * @return {string}
         */
        Matrix2.prototype.toString = function () {
            var text = [];
            for (var i = 0, iLength = this.dimensions; i < iLength; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toString(); }).join(' '));
            }
            return text.join('\n');
        };
        /**
         * Sets this matrix to the identity element for addition, <b>0</b>.
         * @method zero
         * @return {Matrix2}
         * @chainable
         */
        Matrix2.prototype.zero = function () {
            return this.set(0, 0, 0, 0);
        };
        Matrix2.prototype.__add__ = function (rhs) {
            if (rhs instanceof Matrix2) {
                return this.clone().add(rhs);
            }
            else {
                return void 0;
            }
        };
        Matrix2.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Matrix2) {
                return lhs.clone().add(this);
            }
            else {
                return void 0;
            }
        };
        Matrix2.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Matrix2) {
                return this.clone().mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.clone().scale(rhs);
            }
            else {
                return void 0;
            }
        };
        Matrix2.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Matrix2) {
                return lhs.clone().mul(this);
            }
            else if (typeof lhs === 'number') {
                return this.clone().scale(lhs);
            }
            else {
                return void 0;
            }
        };
        Matrix2.prototype.__pos__ = function () {
            return this.clone();
        };
        Matrix2.prototype.__neg__ = function () {
            return this.clone().scale(-1);
        };
        Matrix2.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Matrix2) {
                return this.clone().sub(rhs);
            }
            else {
                return void 0;
            }
        };
        Matrix2.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Matrix2) {
                return lhs.clone().sub(this);
            }
            else {
                return void 0;
            }
        };
        return Matrix2;
    })(AbstractMatrix);
    return Matrix2;
});
