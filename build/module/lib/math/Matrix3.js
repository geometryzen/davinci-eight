import * as tslib_1 from "tslib";
import { AbstractMatrix } from '../math/AbstractMatrix';
import { det3x3 } from '../math/det3x3';
import { inv3x3 } from '../math/inv3x3';
import { lock } from '../core/Lockable';
import { TargetLockedError } from '../core/Lockable';
import { mul3x3 } from '../math/mul3x3';
import { mustBeNumber } from '../checks/mustBeNumber';
function add3x3(a, b, c) {
    var a11 = a[0x0], a12 = a[0x3], a13 = a[0x6];
    var a21 = a[0x1], a22 = a[0x4], a23 = a[0x7];
    var a31 = a[0x2], a32 = a[0x5], a33 = a[0x8];
    var b11 = b[0x0], b12 = b[0x3], b13 = b[0x6];
    var b21 = b[0x1], b22 = b[0x4], b23 = b[0x7];
    var b31 = b[0x2], b32 = b[0x5], b33 = b[0x8];
    c[0x0] = a11 + b11;
    c[0x3] = a12 + b12;
    c[0x6] = a13 + b13;
    c[0x1] = a21 + b21;
    c[0x4] = a22 + b22;
    c[0x7] = a23 + b23;
    c[0x2] = a31 + b31;
    c[0x5] = a32 + b32;
    c[0x8] = a33 + b33;
}
/**
 * <p>
 * A 3x3 (square) matrix of <code>number</code>s.
 * </p>
 * <p>
 * An adapter over a <code>Float32Array</code>, enabling it to be used directly with WebGL.
 * </p>
 * <p>
 * The 9 elements are stored in <em>column-major</em> order (the order expected by WebGL):
 * <table>
 * <tr><td>0</td><td>3</td><td>6</td></tr>
 * <tr><td>1</td><td>4</td><td>7</td></tr>
 * <tr><td>2</td><td>5</td><td>8</td></tr>
 * </table>
 * </p>
 */
var Matrix3 = (function (_super) {
    tslib_1.__extends(Matrix3, _super);
    /**
     * @param elements
     */
    function Matrix3(elements) {
        return _super.call(this, elements, 3) || this;
    }
    /**
     *
     */
    Matrix3.prototype.add = function (rhs) {
        if (this.isLocked()) {
            throw new TargetLockedError('add');
        }
        return this.add2(this, rhs);
    };
    /**
     *
     */
    Matrix3.prototype.add2 = function (a, b) {
        add3x3(a.elements, b.elements, this.elements);
        return this;
    };
    /**
     * Returns a copy of this Matrix3 instance.
     */
    Matrix3.prototype.clone = function () {
        return new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0])).copy(this);
    };
    /**
     * Computes the determinant.
     */
    Matrix3.prototype.det = function () {
        return det3x3(this.elements);
    };
    /**
     * <p>
     * Sets this matrix to the inverse of the upper-left 3x3 portion of a 4x4 matrix.
     * </p>
     *
     * @param matrix
     * @param throwOnSingular
     */
    Matrix3.prototype.invertUpperLeft = function (matrix, throwOnSingular) {
        if (throwOnSingular === void 0) { throwOnSingular = false; }
        var me = matrix.elements;
        var te = this.elements;
        // Compute the determinants of the minors.
        // This is the Laplacian development by minors.
        te[0] = me[0xA] * me[5] - me[6] * me[9];
        te[1] = -me[0xA] * me[1] + me[2] * me[9];
        te[2] = me[6] * me[1] - me[2] * me[5];
        te[3] = -me[10] * me[4] + me[6] * me[8];
        te[4] = me[10] * me[0] - me[2] * me[8];
        te[5] = -me[6] * me[0] + me[2] * me[4];
        te[6] = me[9] * me[4] - me[5] * me[8];
        te[7] = -me[9] * me[0] + me[1] * me[8];
        te[8] = me[5] * me[0] - me[1] * me[4];
        var det = me[0] * te[0] + me[1] * te[3] + me[2] * te[6];
        if (det === 0) {
            var msg = "Matrix3.invertUpperLeft(): can't invert matrix, determinant is 0";
            if (throwOnSingular) {
                // FIXME: At this point we have mutated this matrix.
                // It would be better to leave it unchanged.
                throw new Error(msg);
            }
            else {
                console.warn(msg);
                // We set to the identity matrix to minimize the damage when used in a WebGL shader.
                this.one();
            }
            return this;
        }
        else {
            this.scale(1 / det);
            return this;
        }
    };
    /**
     *
     */
    Matrix3.prototype.inv = function () {
        inv3x3(this.elements, this.elements);
        return this;
    };
    /**
     *
     */
    Matrix3.prototype.isOne = function () {
        var te = this.elements;
        var m11 = te[0x0], m12 = te[0x3], m13 = te[0x6];
        var m21 = te[0x1], m22 = te[0x4], m23 = te[0x7];
        var m31 = te[0x2], m32 = te[0x5], m33 = te[0x8];
        return (m11 === 1 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 1 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 1);
    };
    /**
     *
     */
    Matrix3.prototype.isZero = function () {
        var te = this.elements;
        var m11 = te[0x0], m12 = te[0x3], m13 = te[0x6];
        var m21 = te[0x1], m22 = te[0x4], m23 = te[0x7];
        var m31 = te[0x2], m32 = te[0x5], m33 = te[0x8];
        return (m11 === 0 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 0 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 0);
    };
    /**
     * @param rhs
     */
    Matrix3.prototype.mul = function (rhs) {
        return this.mul2(this, rhs);
    };
    /**
     * @param lhs
     */
    Matrix3.prototype.rmul = function (lhs) {
        mul3x3(lhs.elements, this.elements, this.elements);
        return this;
    };
    /**
     * @param a
     * @param b
     */
    Matrix3.prototype.mul2 = function (a, b) {
        mul3x3(a.elements, b.elements, this.elements);
        return this;
    };
    /**
     *
     */
    Matrix3.prototype.neg = function () {
        return this.scale(-1);
    };
    /**
     * <p>
     * Sets this 3x3 matrix to the matrix required to properly transform normal vectors
     * (pseudo or axial vectors) based upon the 4x4 matrix used to transform polar vectors.
     * </p>
     *
     * @param m
     */
    Matrix3.prototype.normalFromMatrix4 = function (m) {
        return this.invertUpperLeft(m).transpose();
    };
    /**
     *
     */
    Matrix3.prototype.one = function () {
        return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
    };
    /**
     * <p>
     * Sets this matrix to the transformation for a
     * reflection in the plane normal to the unit vector <code>n</code>.
     * </p>
     * <p>
     * <code>this ⟼ reflection(n)</code>
     * </p>
     *
     * @param n
     */
    Matrix3.prototype.reflection = function (n) {
        var nx = mustBeNumber('n.x', n.x);
        var ny = mustBeNumber('n.y', n.y);
        var aa = -2 * nx * ny;
        var xx = 1 - 2 * nx * nx;
        var yy = 1 - 2 * ny * ny;
        this.set(xx, aa, 0, aa, yy, 0, 0, 0, 1);
        return this;
    };
    /**
     * @param i the zero-based index of the row.
     */
    Matrix3.prototype.row = function (i) {
        var te = this.elements;
        return [te[0 + i], te[3 + i], te[6 + i]];
    };
    /**
     * @param spinor
     */
    Matrix3.prototype.rotate = function (spinor) {
        // TODO: This is creating a temporary.
        return this.rmul(Matrix3.rotation(spinor));
    };
    /**
     * @param spinor
     */
    Matrix3.prototype.rotation = function (spinor) {
        var α = spinor.a;
        var β = spinor.b;
        var S = α * α - β * β;
        var A = 2 * α * β;
        this.set(S, A, 0, -A, S, 0, 0, 0, 1);
        return this;
    };
    /**
     * @param s
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
     * <p>
     * Sets all elements of this matrix to the supplied values (provided in <em>row-major</em> order).
     * </p>
     * <p>
     * An advantage of this method is that the function call resembles the matrix written out.
     * </p>
     * <p>
     * The parameters are named according to the 1-based row and column.
     * </p>
     *
     * @param n11
     * @param n12
     * @param n13
     * @param n21
     * @param n22
     * @param n23
     * @param n31
     * @param n32
     * @param n33
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
     * @param rhs
     */
    Matrix3.prototype.sub = function (rhs) {
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
    /**
     * @param fractionDigits
     */
    Matrix3.prototype.toExponential = function (fractionDigits) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toExponential(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * @param fractionDigits
     */
    Matrix3.prototype.toFixed = function (fractionDigits) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toFixed(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * @param precision
     */
    Matrix3.prototype.toPrecision = function (precision) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toPrecision(precision); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * @param radix
     */
    Matrix3.prototype.toString = function (radix) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toString(radix); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * <p>
     * Computes the homogeneous translation matrix for a 2D translation.
     * </p>
     *
     * @param d
     */
    Matrix3.prototype.translation = function (d) {
        var x = d.x;
        var y = d.y;
        return this.set(1, 0, x, 0, 1, y, 0, 0, 1);
    };
    /**
     *
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
     * @param n
     */
    Matrix3.reflection = function (n) {
        return Matrix3.zero.clone().reflection(n);
    };
    /**
     * @param spinor
     */
    Matrix3.rotation = function (spinor) {
        return Matrix3.zero.clone().rotation(spinor);
    };
    /**
     * @param d
     */
    Matrix3.translation = function (d) {
        return Matrix3.zero.clone().translation(d);
    };
    /**
     * The identity matrix for multiplication.
     * The matrix is locked (immutable), but may be cloned.
     */
    Matrix3.one = lock(new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])));
    /**
     * The identity matrix for addition.
     * The matrix is locked (immutable), but may be cloned.
     */
    Matrix3.zero = lock(new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0])));
    return Matrix3;
}(AbstractMatrix));
export { Matrix3 };
