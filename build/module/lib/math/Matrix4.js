import * as tslib_1 from "tslib";
import { AbstractMatrix } from '../math/AbstractMatrix';
import { det4x4 } from './det4x4';
import { inv4x4 } from '../math/inv4x4';
import { lock, TargetLockedError } from '../core/Lockable';
import { mul4x4 } from '../math/mul4x4';
import { perspectiveArray } from '../facets/perspectiveArray';
function add4x4(a, b, c) {
    var a11 = a[0x0], a12 = a[0x4], a13 = a[0x8], a14 = a[0xC];
    var a21 = a[0x1], a22 = a[0x5], a23 = a[0x9], a24 = a[0xD];
    var a31 = a[0x2], a32 = a[0x6], a33 = a[0xA], a34 = a[0xE];
    var a41 = a[0x3], a42 = a[0x7], a43 = a[0xB], a44 = a[0xF];
    var b11 = b[0x0], b12 = b[0x4], b13 = b[0x8], b14 = b[0xC];
    var b21 = b[0x1], b22 = b[0x5], b23 = b[0x9], b24 = b[0xD];
    var b31 = b[0x2], b32 = b[0x6], b33 = b[0xA], b34 = b[0xE];
    var b41 = b[0x3], b42 = b[0x7], b43 = b[0xB], b44 = b[0xF];
    c[0x0] = a11 + b11;
    c[0x4] = a12 + b12;
    c[0x8] = a13 + b13;
    c[0xC] = a14 + b14;
    c[0x1] = a21 + b21;
    c[0x5] = a22 + b22;
    c[0x9] = a23 + b23;
    c[0xD] = a24 + b24;
    c[0x2] = a31 + b31;
    c[0x6] = a32 + b32;
    c[0xA] = a33 + b33;
    c[0xE] = a34 + b34;
    c[0x3] = a41 + b41;
    c[0x7] = a42 + b42;
    c[0xB] = a43 + b43;
    c[0xF] = a44 + b44;
}
/**
 * A 4x4 (square) matrix of numbers.
 *
 * An adapter for a `Float32Array`.
 */
var Matrix4 = (function (_super) {
    tslib_1.__extends(Matrix4, _super);
    // The correspondence between the elements property index and the matrix entries is...
    //
    //  0  4  8 12
    //  1  5  9 13
    //  2  6 10 14
    //  3  7 11 15
    /**
     *
     */
    function Matrix4(elements) {
        return _super.call(this, elements, 4) || this;
    }
    /**
     * Constructs a 4x4 matrix that performs the scaling specified by the vector.
     */
    Matrix4.scaling = function (scale) {
        return Matrix4.one.clone().scaling(scale);
    };
    /**
     * Constructs a 4x4 matrix that performs the translation specified by the vector.
     */
    Matrix4.translation = function (vector) {
        return Matrix4.one.clone().translation(vector);
    };
    /**
     * Constructs a 4x4 matrix that performs the rotation specified by the spinor.
     */
    Matrix4.rotation = function (spinor) {
        return Matrix4.one.clone().rotation(spinor);
    };
    /**
     * Sets this matrix to `this + rhs`.
     */
    Matrix4.prototype.add = function (rhs) {
        if (this.isLocked()) {
            throw new TargetLockedError('add');
        }
        return this.add2(this, rhs);
    };
    /**
     * Sets this matrix to `a + b`.
     */
    Matrix4.prototype.add2 = function (a, b) {
        add4x4(a.elements, b.elements, this.elements);
        return this;
    };
    /**
     * Returns a copy of this Matrix4 instance.
     */
    Matrix4.prototype.clone = function () {
        return new Matrix4(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).copy(this);
    };
    /**
     * Sets this matrix to perform the specified scaling, rotation, and translation.
     */
    Matrix4.prototype.compose = function (S, R, T) {
        this.scaling(S);
        this.rotate(R);
        this.translate(T);
        return this;
    };
    /**
     * Copies the specified matrix into this matrix.
     */
    Matrix4.prototype.copy = function (m) {
        this.elements.set(m.elements);
        return this;
    };
    /**
     * Computes the determinant.
     */
    Matrix4.prototype.det = function () {
        return det4x4(this.elements);
    };
    /**
     * Sets the elements of this matrix to that of its inverse.
     */
    Matrix4.prototype.inv = function () {
        inv4x4(this.elements, this.elements);
        return this;
    };
    /**
     * Sets this matrix to the identity element for multiplication, <b>1</b>.
     */
    Matrix4.prototype.one = function () {
        return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    };
    /**
     * Multiplies all elements of this matrix by the specified value.
     */
    Matrix4.prototype.scale = function (s) {
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
    /**
     * Sets this matrix to its transpose.
     */
    Matrix4.prototype.transpose = function () {
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
    /**
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param near
     * @param far
     */
    Matrix4.prototype.frustum = function (left, right, bottom, top, near, far) {
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
    /**
     * Sets this matrix to the viewing transformation.
     * This is the matrix that may be applied to points in the truncated viewing pyramid.
     * The resulting points then lie in the image space (cube).
     */
    Matrix4.prototype.perspective = function (fov, aspect, near, far) {
        perspectiveArray(fov, aspect, near, far, this.elements);
        return this;
    };
    /**
     * @param axis
     * @param angle
     */
    Matrix4.prototype.rotationAxis = function (axis, angle) {
        // Based on http://www.gamedev.net/reference/articles/article1199.asp
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var t = 1 - c;
        var x = axis.x, y = axis.y, z = axis.z;
        var tx = t * x, ty = t * y;
        return this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
    };
    /**
     *
     */
    Matrix4.prototype.mul = function (rhs) {
        return this.mul2(this, rhs);
    };
    /**
     *
     */
    Matrix4.prototype.mul2 = function (a, b) {
        mul4x4(a.elements, b.elements, this.elements);
        return this;
    };
    /**
     *
     */
    Matrix4.prototype.rmul = function (lhs) {
        return this.mul2(lhs, this);
    };
    /**
     * Sets this matrix to the transformation for a
     * reflection in the plane normal to the unit vector <code>n</code>.
     *
     * this ⟼ reflection(n)
     *
     * @param n
     */
    Matrix4.prototype.reflection = function (n) {
        var nx = n.x;
        var ny = n.y;
        var nz = n.z;
        var aa = -2 * nx * ny;
        var cc = -2 * ny * nz;
        var bb = -2 * nz * nx;
        var xx = 1 - 2 * nx * nx;
        var yy = 1 - 2 * ny * ny;
        var zz = 1 - 2 * nz * nz;
        this.set(xx, aa, bb, 0, aa, yy, cc, 0, bb, cc, zz, 0, 0, 0, 0, 1);
        return this;
    };
    /**
     * this ⟼ rotation(spinor) * this
     *
     * @param spinor
     */
    Matrix4.prototype.rotate = function (spinor) {
        return this.rmul(Matrix4.rotation(spinor));
    };
    /**
     * Sets this matrix to be equivalent to the spinor.
     *
     * this ⟼ rotation(spinor)
     *
     * @param attitude  The spinor from which the rotation will be computed.
     */
    Matrix4.prototype.rotation = function (spinor) {
        // The correspondence between quaternions and spinors is
        // i <=> -e2^e3, j <=> -e3^e1, k <=> -e1^e2.
        var x = -spinor.yz;
        var y = -spinor.zx;
        var z = -spinor.xy;
        var α = spinor.a;
        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;
        var xx = x * x2;
        var xy = x * y2;
        var xz = x * z2;
        var yy = y * y2;
        var yz = y * z2;
        var zz = z * z2;
        var wx = α * x2;
        var wy = α * y2;
        var wz = α * z2;
        this.set(1 - yy - zz, xy - wz, xz + wy, 0, xy + wz, 1 - xx - zz, yz - wx, 0, xz - wy, yz + wx, 1 - xx - yy, 0, 0, 0, 0, 1);
        return this;
    };
    /**
     * @param i the zero-based index of the row.
     */
    Matrix4.prototype.row = function (i) {
        var te = this.elements;
        return [te[0 + i], te[4 + i], te[8 + i], te[12 + i]];
    };
    /**
     *
     */
    Matrix4.prototype.scaleXYZ = function (scale) {
        // We treat the scale operation as pre-multiplication: 
        // |x 0 0 0|   |m[0] m[4] m[8] m[C]|   |x * m[0] x * m[4] x * m[8] x * m[C]|
        // |0 y 0 0| * |m[1] m[5] m[9] m[D]| = |y * m[1] y * m[5] y * m[9] y * m[D]|
        // |0 0 z 0|   |m[2] m[6] m[A] m[E]|   |z * m[2] z * m[6] z * m[A] z * m[E]|
        // |0 0 0 1|   |m[3] m[7] m[B] m[F]|   |    m[3]     m[7]     m[B]     m[F]|
        // The following would be post-multiplication:
        // |m[0] m[4] m[8] m[C]|   |x 0 0 0|   |x * m[0] y * m[4] z * m[8]     m[C]|
        // |m[1] m[5] m[9] m[D]| * |0 y 0 0| = |x * m[1] y * m[5] z * m[9]     m[D]|
        // |m[2] m[6] m[A] m[E]|   |0 0 z 0|   |x * m[2] y * m[6] z * m[A]     m[E]|
        // |m[3] m[7] m[B] m[F]|   |0 0 0 1|   |x * m[3] y * m[7] z * m[B]     m[F]|
        return this.rmul(Matrix4.scaling(scale));
    };
    /**
     *
     */
    Matrix4.prototype.scaling = function (scale) {
        return this.set(scale.x, 0, 0, 0, 0, scale.y, 0, 0, 0, 0, scale.z, 0, 0, 0, 0, 1);
    };
    /**
     *
     */
    Matrix4.prototype.set = function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
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
    /**
     *
     */
    Matrix4.prototype.toExponential = function (fractionDigits) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toExponential(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     *
     */
    Matrix4.prototype.toFixed = function (fractionDigits) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toFixed(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     *
     */
    Matrix4.prototype.toPrecision = function (fractionDigits) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toPrecision(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     *
     */
    Matrix4.prototype.toString = function (radix) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toString(radix); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * this ⟼ translation(spinor) * this
     */
    Matrix4.prototype.translate = function (d) {
        return this.rmul(Matrix4.translation(d));
    };
    /**
     * Sets this matrix to be equivalent to the displacement vector argument.
     */
    Matrix4.prototype.translation = function (displacement) {
        var x = displacement.x;
        var y = displacement.y;
        var z = displacement.z;
        return this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
    };
    /**
     * Sets this matrix to the identity element for addition, 0.
     */
    Matrix4.prototype.zero = function () {
        return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    };
    Matrix4.prototype.__mul__ = function (rhs) {
        if (rhs instanceof Matrix4) {
            return lock(Matrix4.one.clone().mul2(this, rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(this.clone().scale(rhs));
        }
        else {
            return void 0;
        }
    };
    Matrix4.prototype.__rmul__ = function (lhs) {
        if (lhs instanceof Matrix4) {
            return lock(Matrix4.one.clone().mul2(lhs, this));
        }
        else if (typeof lhs === 'number') {
            return lock(this.clone().scale(lhs));
        }
        else {
            return void 0;
        }
    };
    return Matrix4;
}(AbstractMatrix));
export { Matrix4 };
/**
 * The identity matrix for multiplication, 1.
 * The matrix is locked (immutable), but may be cloned.
 */
Matrix4.one = lock(new Matrix4(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])));
/**
 * The identity matrix for addition, 0.
 * The matrix is locked (immutable), but may be cloned.
 */
Matrix4.zero = lock(new Matrix4(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])));
