var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/AbstractMatrix', '../math/add2x2', '../math/det2x2', '../checks/isDefined', '../checks/mustBeInteger', '../checks/mustBeNumber'], function (require, exports, AbstractMatrix_1, add2x2_1, det2x2_1, isDefined_1, mustBeInteger_1, mustBeNumber_1) {
    var Mat2R = (function (_super) {
        __extends(Mat2R, _super);
        function Mat2R(elements) {
            _super.call(this, elements, 2);
        }
        Mat2R.prototype.add = function (rhs) {
            return this.add2(this, rhs);
        };
        Mat2R.prototype.add2 = function (a, b) {
            add2x2_1.default(a.elements, b.elements, this.elements);
            return this;
        };
        Mat2R.prototype.clone = function () {
            var te = this.elements;
            var m11 = te[0];
            var m21 = te[1];
            var m12 = te[2];
            var m22 = te[3];
            return Mat2R.zero().set(m11, m12, m21, m22);
        };
        Mat2R.prototype.det = function () {
            return det2x2_1.default(this.elements);
        };
        Mat2R.prototype.inv = function () {
            var te = this.elements;
            var a = te[0];
            var c = te[1];
            var b = te[2];
            var d = te[3];
            var det = this.det();
            return this.set(d, -b, -c, a).scale(1 / det);
        };
        Mat2R.prototype.isOne = function () {
            var te = this.elements;
            var a = te[0];
            var c = te[1];
            var b = te[2];
            var d = te[3];
            return (a === 1 && b === 0 && c === 0 && d === 1);
        };
        Mat2R.prototype.isZero = function () {
            var te = this.elements;
            var a = te[0];
            var c = te[1];
            var b = te[2];
            var d = te[3];
            return (a === 0 && b === 0 && c === 0 && d === 0);
        };
        Mat2R.prototype.mul = function (rhs) {
            return this.mul2(this, rhs);
        };
        Mat2R.prototype.mul2 = function (a, b) {
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
        Mat2R.prototype.neg = function () {
            return this.scale(-1);
        };
        Mat2R.prototype.one = function () {
            return this.set(1, 0, 0, 1);
        };
        Mat2R.prototype.reflection = function (n) {
            var nx = mustBeNumber_1.default('n.x', n.x);
            var xx = 1 - 2 * nx * nx;
            return this.set(xx, 0, 0, 1);
        };
        Mat2R.prototype.row = function (i) {
            var te = this.elements;
            return [te[0 + i], te[2 + i]];
        };
        Mat2R.prototype.scale = function (α) {
            var te = this.elements;
            var m11 = te[0] * α;
            var m21 = te[1] * α;
            var m12 = te[2] * α;
            var m22 = te[3] * α;
            return this.set(m11, m12, m21, m22);
        };
        Mat2R.prototype.set = function (m11, m12, m21, m22) {
            var te = this.elements;
            te[0x0] = m11;
            te[0x2] = m12;
            te[0x1] = m21;
            te[0x3] = m22;
            return this;
        };
        Mat2R.prototype.sub = function (rhs) {
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
        Mat2R.prototype.toExponential = function () {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toExponential(); }).join(' '));
            }
            return text.join('\n');
        };
        Mat2R.prototype.toFixed = function (digits) {
            if (isDefined_1.default(digits)) {
                mustBeInteger_1.default('digits', digits);
            }
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toFixed(digits); }).join(' '));
            }
            return text.join('\n');
        };
        Mat2R.prototype.toString = function () {
            var text = [];
            for (var i = 0, iLength = this.dimensions; i < iLength; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toString(); }).join(' '));
            }
            return text.join('\n');
        };
        Mat2R.prototype.translation = function (d) {
            var x = d.x;
            return this.set(1, x, 0, 1);
        };
        Mat2R.prototype.zero = function () {
            return this.set(0, 0, 0, 0);
        };
        Mat2R.prototype.__add__ = function (rhs) {
            if (rhs instanceof Mat2R) {
                return this.clone().add(rhs);
            }
            else {
                return void 0;
            }
        };
        Mat2R.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Mat2R) {
                return lhs.clone().add(this);
            }
            else {
                return void 0;
            }
        };
        Mat2R.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Mat2R) {
                return this.clone().mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.clone().scale(rhs);
            }
            else {
                return void 0;
            }
        };
        Mat2R.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Mat2R) {
                return lhs.clone().mul(this);
            }
            else if (typeof lhs === 'number') {
                return this.clone().scale(lhs);
            }
            else {
                return void 0;
            }
        };
        Mat2R.prototype.__pos__ = function () {
            return this.clone();
        };
        Mat2R.prototype.__neg__ = function () {
            return this.clone().scale(-1);
        };
        Mat2R.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Mat2R) {
                return this.clone().sub(rhs);
            }
            else {
                return void 0;
            }
        };
        Mat2R.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Mat2R) {
                return lhs.clone().sub(this);
            }
            else {
                return void 0;
            }
        };
        Mat2R.one = function () {
            return new Mat2R(new Float32Array([1, 0, 0, 1]));
        };
        Mat2R.reflection = function (n) {
            return Mat2R.zero().reflection(n);
        };
        Mat2R.zero = function () {
            return new Mat2R(new Float32Array([0, 0, 0, 0]));
        };
        return Mat2R;
    })(AbstractMatrix_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Mat2R;
});
