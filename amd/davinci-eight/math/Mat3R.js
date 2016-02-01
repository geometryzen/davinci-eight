var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/AbstractMatrix', '../math/add3x3', '../math/det3x3', '../math/inv3x3', '../math/mul3x3', '../checks/mustBeNumber'], function (require, exports, AbstractMatrix_1, add3x3_1, det3x3_1, inv3x3_1, mul3x3_1, mustBeNumber_1) {
    var Mat3R = (function (_super) {
        __extends(Mat3R, _super);
        function Mat3R(elements) {
            _super.call(this, elements, 3);
        }
        Mat3R.prototype.add = function (rhs) {
            return this.add2(this, rhs);
        };
        Mat3R.prototype.add2 = function (a, b) {
            add3x3_1.default(a.elements, b.elements, this.elements);
            return this;
        };
        Mat3R.prototype.clone = function () {
            return Mat3R.zero().copy(this);
        };
        Mat3R.prototype.det = function () {
            return det3x3_1.default(this.elements);
        };
        Mat3R.prototype.getInverse = function (matrix, throwOnInvertible) {
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
            if (det === 0) {
                var msg = "Mat3R.getInverse(): can't invert matrix, determinant is 0";
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
        Mat3R.prototype.inv = function () {
            inv3x3_1.default(this.elements, this.elements);
            return this;
        };
        Mat3R.prototype.isOne = function () {
            var te = this.elements;
            var m11 = te[0x0], m12 = te[0x3], m13 = te[0x6];
            var m21 = te[0x1], m22 = te[0x4], m23 = te[0x7];
            var m31 = te[0x2], m32 = te[0x5], m33 = te[0x8];
            return (m11 === 1 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 1 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 1);
        };
        Mat3R.prototype.isZero = function () {
            var te = this.elements;
            var m11 = te[0x0], m12 = te[0x3], m13 = te[0x6];
            var m21 = te[0x1], m22 = te[0x4], m23 = te[0x7];
            var m31 = te[0x2], m32 = te[0x5], m33 = te[0x8];
            return (m11 === 0 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 0 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 0);
        };
        Mat3R.prototype.mul = function (rhs) {
            return this.mul2(this, rhs);
        };
        Mat3R.prototype.mul2 = function (a, b) {
            mul3x3_1.default(a.elements, b.elements, this.elements);
            return this;
        };
        Mat3R.prototype.neg = function () {
            return this.scale(-1);
        };
        Mat3R.prototype.normalFromMat4R = function (m) {
            return this.getInverse(m).transpose();
        };
        Mat3R.prototype.one = function () {
            return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        };
        Mat3R.prototype.reflection = function (n) {
            var nx = mustBeNumber_1.default('n.x', n.x);
            var ny = mustBeNumber_1.default('n.y', n.y);
            var aa = -2 * nx * ny;
            var xx = 1 - 2 * nx * nx;
            var yy = 1 - 2 * ny * ny;
            this.set(xx, aa, 0, aa, yy, 0, 0, 0, 1);
            return this;
        };
        Mat3R.prototype.row = function (i) {
            var te = this.elements;
            return [te[0 + i], te[3 + i], te[6 + i]];
        };
        Mat3R.prototype.scale = function (s) {
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
        Mat3R.prototype.set = function (n11, n12, n13, n21, n22, n23, n31, n32, n33) {
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
        Mat3R.prototype.sub = function (rhs) {
            var te = this.elements;
            var t11 = te[0];
            var t21 = te[1];
            var t31 = te[2];
            var t12 = te[3];
            var t22 = te[4];
            var t32 = te[5];
            var t13 = te[6];
            var t23 = te[7];
            var t33 = te[5];
            var re = rhs.elements;
            var r11 = re[0];
            var r21 = re[1];
            var r31 = re[2];
            var r12 = re[3];
            var r22 = re[4];
            var r32 = re[5];
            var r13 = re[6];
            var r23 = re[7];
            var r33 = re[8];
            var m11 = t11 - r11;
            var m21 = t21 - r21;
            var m31 = t31 - r31;
            var m12 = t12 - r12;
            var m22 = t22 - r22;
            var m32 = t32 - r32;
            var m13 = t13 - r13;
            var m23 = t23 - r23;
            var m33 = t33 - r33;
            return this.set(m11, m12, m13, m21, m22, m23, m31, m32, m33);
        };
        Mat3R.prototype.toString = function () {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toString(); }).join(' '));
            }
            return text.join('\n');
        };
        Mat3R.prototype.translation = function (d) {
            var x = d.x;
            var y = d.y;
            return this.set(1, 0, x, 0, 1, y, 0, 0, 1);
        };
        Mat3R.prototype.transpose = function () {
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
        Mat3R.prototype.zero = function () {
            return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
        };
        Mat3R.prototype.__add__ = function (rhs) {
            if (rhs instanceof Mat3R) {
                return this.clone().add(rhs);
            }
            else {
                return void 0;
            }
        };
        Mat3R.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Mat3R) {
                return lhs.clone().add(this);
            }
            else {
                return void 0;
            }
        };
        Mat3R.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Mat3R) {
                return this.clone().mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.clone().scale(rhs);
            }
            else {
                return void 0;
            }
        };
        Mat3R.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Mat3R) {
                return lhs.clone().mul(this);
            }
            else if (typeof lhs === 'number') {
                return this.clone().scale(lhs);
            }
            else {
                return void 0;
            }
        };
        Mat3R.prototype.__pos__ = function () {
            return this.clone();
        };
        Mat3R.prototype.__neg__ = function () {
            return this.clone().scale(-1);
        };
        Mat3R.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Mat3R) {
                return this.clone().sub(rhs);
            }
            else {
                return void 0;
            }
        };
        Mat3R.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Mat3R) {
                return lhs.clone().sub(this);
            }
            else {
                return void 0;
            }
        };
        Mat3R.one = function () {
            return new Mat3R(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
        };
        Mat3R.reflection = function (n) {
            return Mat3R.zero().reflection(n);
        };
        Mat3R.zero = function () {
            return new Mat3R(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]));
        };
        return Mat3R;
    })(AbstractMatrix_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Mat3R;
});
