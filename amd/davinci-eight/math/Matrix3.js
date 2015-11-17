var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/AbstractMatrix'], function (require, exports, AbstractMatrix) {
    /**
     * @class Matrix3
     * @extends AbstractMatrix
     */
    var Matrix3 = (function (_super) {
        __extends(Matrix3, _super);
        /**
         * 3x3 (square) matrix of numbers.
         * Constructs a Matrix3 by wrapping a Float32Array.
         * @class Matrix3
         * @constructor
         */
        function Matrix3(elements) {
            _super.call(this, elements, 3);
        }
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
        Matrix3.prototype.determinant = function () {
            return 1;
        };
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
         * @method one
         * @return {Matrix3}
         * @chainable
         */
        Matrix3.prototype.one = function () {
            return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        };
        Matrix3.prototype.mul = function (rhs) {
            return this.mul2(this, rhs);
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
        Matrix3.prototype.mul2 = function (a, b) {
            return this;
        };
        Matrix3.prototype.normalFromMatrix4 = function (m) {
            this.getInverse(m).transpose();
        };
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
        Matrix3.prototype.toString = function () {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toString(); }).join(' '));
            }
            return text.join('\n');
        };
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
        return Matrix3;
    })(AbstractMatrix);
    return Matrix3;
});
