var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/AbstractMatrix', '../math/add4x4', '../checks/expectArg', '../math/inv4x4', '../checks/isDefined', '../math/mul4x4', '../checks/mustBeNumber'], function (require, exports, AbstractMatrix_1, add4x4_1, expectArg_1, inv4x4_1, isDefined_1, mul4x4_1, mustBeNumber_1) {
    var Mat4R = (function (_super) {
        __extends(Mat4R, _super);
        function Mat4R(elements) {
            _super.call(this, elements, 4);
        }
        Mat4R.one = function () {
            return new Mat4R(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
        };
        Mat4R.zero = function () {
            return new Mat4R(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        };
        Mat4R.scaling = function (scale) {
            return Mat4R.one().scaling(scale);
        };
        Mat4R.translation = function (vector) {
            return Mat4R.one().translation(vector);
        };
        Mat4R.rotation = function (spinor) {
            return Mat4R.one().rotation(spinor);
        };
        Mat4R.prototype.add = function (rhs) {
            return this.add2(this, rhs);
        };
        Mat4R.prototype.add2 = function (a, b) {
            add4x4_1.default(a.elements, b.elements, this.elements);
            return this;
        };
        Mat4R.prototype.clone = function () {
            return Mat4R.zero().copy(this);
        };
        Mat4R.prototype.compose = function (scale, attitude, position) {
            this.scaling(scale);
            this.rotate(attitude);
            this.translate(position);
            return this;
        };
        Mat4R.prototype.copy = function (m) {
            this.elements.set(m.elements);
            return this;
        };
        Mat4R.prototype.det = function () {
            var te = this.elements;
            var n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
            var n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
            var n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
            var n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];
            var n1122 = n11 * n22;
            var n1123 = n11 * n23;
            var n1124 = n11 * n24;
            var n1221 = n12 * n21;
            var n1223 = n12 * n23;
            var n1224 = n12 * n24;
            var n1321 = n13 * n21;
            var n1322 = n13 * n22;
            var n1324 = n13 * n24;
            var n1421 = n14 * n21;
            var n1422 = n14 * n22;
            var n1423 = n14 * n23;
            return n41 * ((n1423 - n1324) * n32 + (n1224 - n1422) * n33 + (n1322 - n1223) * n34) +
                n42 * ((n1324 - n1423) * n31 + (n1421 - n1124) * n33 + (n1123 - n1321) * n34) +
                n43 * ((n1422 - n1224) * n31 + (n1124 - n1421) * n32 + (n1221 - n1122) * n34) +
                n44 * ((n1223 - n1322) * n31 + (n1321 - n1123) * n32 + (n1122 - n1221) * n33);
        };
        Mat4R.prototype.inv = function () {
            inv4x4_1.default(this.elements, this.elements);
            return this;
        };
        Mat4R.prototype.invert = function (m) {
            inv4x4_1.default(m.elements, this.elements);
            return this;
        };
        Mat4R.prototype.one = function () {
            return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        };
        Mat4R.prototype.scale = function (s) {
            var te = this.elements;
            te[0] *= s;
            te[4] *= s;
            te[8] *= s;
            te[12] *= s;
            te[1] *= s;
            te[5] *= s;
            te[9] *= s;
            te[13] *= s;
            te[2] *= s;
            te[6] *= s;
            te[10] *= s;
            te[14] *= s;
            te[3] *= s;
            te[7] *= s;
            te[11] *= s;
            te[15] *= s;
            return this;
        };
        Mat4R.prototype.transpose = function () {
            var te = this.elements;
            var tmp;
            tmp = te[1];
            te[1] = te[4];
            te[4] = tmp;
            tmp = te[2];
            te[2] = te[8];
            te[8] = tmp;
            tmp = te[6];
            te[6] = te[9];
            te[9] = tmp;
            tmp = te[3];
            te[3] = te[12];
            te[12] = tmp;
            tmp = te[7];
            te[7] = te[13];
            te[13] = tmp;
            tmp = te[11];
            te[11] = te[14];
            te[14] = tmp;
            return this;
        };
        Mat4R.prototype.frustum = function (left, right, bottom, top, near, far) {
            var te = this.elements;
            var x = 2 * near / (right - left);
            var y = 2 * near / (top - bottom);
            var a = (right + left) / (right - left);
            var b = (top + bottom) / (top - bottom);
            var c = -(far + near) / (far - near);
            var d = -2 * far * near / (far - near);
            te[0] = x;
            te[4] = 0;
            te[8] = a;
            te[12] = 0;
            te[1] = 0;
            te[5] = y;
            te[9] = b;
            te[13] = 0;
            te[2] = 0;
            te[6] = 0;
            te[10] = c;
            te[14] = d;
            te[3] = 0;
            te[7] = 0;
            te[11] = -1;
            te[15] = 0;
            return this;
        };
        Mat4R.prototype.rotationAxis = function (axis, angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var t = 1 - c;
            var x = axis.x, y = axis.y, z = axis.z;
            var tx = t * x, ty = t * y;
            return this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
        };
        Mat4R.prototype.mul = function (rhs) {
            return this.mul2(this, rhs);
        };
        Mat4R.prototype.mul2 = function (a, b) {
            mul4x4_1.default(a.elements, b.elements, this.elements);
            return this;
        };
        Mat4R.prototype.rmul = function (lhs) {
            return this.mul2(lhs, this);
        };
        Mat4R.prototype.reflection = function (n) {
            var nx = mustBeNumber_1.default('n.x', n.x);
            var ny = mustBeNumber_1.default('n.y', n.y);
            var nz = mustBeNumber_1.default('n.z', n.z);
            var aa = -2 * nx * ny;
            var cc = -2 * ny * nz;
            var bb = -2 * nz * nx;
            var xx = 1 - 2 * nx * nx;
            var yy = 1 - 2 * ny * ny;
            var zz = 1 - 2 * nz * nz;
            this.set(xx, aa, bb, 0, aa, yy, cc, 0, bb, cc, zz, 0, 0, 0, 0, 1);
            return this;
        };
        Mat4R.prototype.rotate = function (spinor) {
            return this.rmul(Mat4R.rotation(spinor));
        };
        Mat4R.prototype.rotation = function (spinor) {
            var x = -expectArg_1.default('spinor.yz', spinor.yz).toBeNumber().value;
            var y = -expectArg_1.default('spinor.zx', spinor.zx).toBeNumber().value;
            var z = -expectArg_1.default('spinor.xy', spinor.xy).toBeNumber().value;
            var α = expectArg_1.default('spinor.α', spinor.α).toBeNumber().value;
            var x2 = x + x, y2 = y + y, z2 = z + z;
            var xx = x * x2, xy = x * y2, xz = x * z2;
            var yy = y * y2, yz = y * z2, zz = z * z2;
            var wx = α * x2, wy = α * y2, wz = α * z2;
            this.set(1 - yy - zz, xy - wz, xz + wy, 0, xy + wz, 1 - xx - zz, yz - wx, 0, xz - wy, yz + wx, 1 - xx - yy, 0, 0, 0, 0, 1);
            return this;
        };
        Mat4R.prototype.row = function (i) {
            var te = this.elements;
            return [te[0 + i], te[4 + i], te[8 + i], te[12 + i]];
        };
        Mat4R.prototype.scaleXYZ = function (scale) {
            return this.rmul(Mat4R.scaling(scale));
        };
        Mat4R.prototype.scaling = function (scale) {
            return this.set(scale.x, 0, 0, 0, 0, scale.y, 0, 0, 0, 0, scale.z, 0, 0, 0, 0, 1);
        };
        Mat4R.prototype.set = function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
            var te = this.elements;
            te[0x0] = n11;
            te[0x4] = n12;
            te[0x8] = n13;
            te[0xC] = n14;
            te[0x1] = n21;
            te[0x5] = n22;
            te[0x9] = n23;
            te[0xD] = n24;
            te[0x2] = n31;
            te[0x6] = n32;
            te[0xA] = n33;
            te[0xE] = n34;
            te[0x3] = n41;
            te[0x7] = n42;
            te[0xB] = n43;
            te[0xF] = n44;
            return this;
        };
        Mat4R.prototype.toFixed = function (digits) {
            if (isDefined_1.default(digits)) {
                expectArg_1.default('digits', digits).toBeNumber();
            }
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toFixed(digits); }).join(' '));
            }
            return text.join('\n');
        };
        Mat4R.prototype.toString = function () {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toString(); }).join(' '));
            }
            return text.join('\n');
        };
        Mat4R.prototype.translate = function (d) {
            return this.rmul(Mat4R.translation(d));
        };
        Mat4R.prototype.translation = function (d) {
            var x = d.x;
            var y = d.y;
            var z = d.z;
            return this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
        };
        Mat4R.prototype.zero = function () {
            return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        };
        Mat4R.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Mat4R) {
                return Mat4R.one().mul2(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return this.clone().scale(rhs);
            }
            else {
                return void 0;
            }
        };
        Mat4R.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Mat4R) {
                return Mat4R.one().mul2(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return this.clone().scale(lhs);
            }
            else {
                return void 0;
            }
        };
        return Mat4R;
    })(AbstractMatrix_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Mat4R;
});
