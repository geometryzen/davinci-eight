"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var AbstractMatrix_1 = require("../math/AbstractMatrix");
var det2x2_1 = require("../math/det2x2");
var isDefined_1 = require("../checks/isDefined");
var Lockable_1 = require("../core/Lockable");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var mustBeNumber_1 = require("../checks/mustBeNumber");
function add2x2(a, b, c) {
    var a11 = a[0x0], a12 = a[0x2];
    var a21 = a[0x1], a22 = a[0x3];
    var b11 = b[0x0], b12 = b[0x2];
    var b21 = b[0x1], b22 = b[0x3];
    c[0x0] = a11 + b11;
    c[0x2] = a12 + b12;
    c[0x1] = a21 + b21;
    c[0x3] = a22 + b22;
}
/**
 *
 */
var Matrix2 = (function (_super) {
    tslib_1.__extends(Matrix2, _super);
    /**
     * 2x2 (square) matrix of numbers.
     * Constructs a Matrix2 by wrapping a Float32Array.
     * The elements are stored in column-major order:
     * 0 2
     * 1 3
     *
     * @param elements The elements of the matrix in column-major order.
     */
    function Matrix2(elements) {
        return _super.call(this, elements, 2) || this;
    }
    Matrix2.prototype.add = function (rhs) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('add');
        }
        return this.add2(this, rhs);
    };
    Matrix2.prototype.add2 = function (a, b) {
        add2x2(a.elements, b.elements, this.elements);
        return this;
    };
    Matrix2.prototype.clone = function () {
        var te = this.elements;
        var m11 = te[0];
        var m21 = te[1];
        var m12 = te[2];
        var m22 = te[3];
        return new Matrix2(new Float32Array([0, 0, 0, 0])).set(m11, m12, m21, m22);
    };
    /**
     * Computes the determinant.
     */
    Matrix2.prototype.det = function () {
        return det2x2_1.det2x2(this.elements);
    };
    /**
     * Sets this matrix to its inverse.
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
     * Determines whether this matrix is the identity matrix for multiplication.
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
     * Determines whether this matrix is the identity matrix for addition.
     */
    Matrix2.prototype.isZero = function () {
        var te = this.elements;
        var a = te[0];
        var c = te[1];
        var b = te[2];
        var d = te[3];
        return (a === 0 && b === 0 && c === 0 && d === 0);
    };
    Matrix2.prototype.mul = function (rhs) {
        return this.mul2(this, rhs);
    };
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
     * Sets this matrix to its additive inverse.
     */
    Matrix2.prototype.neg = function () {
        return this.scale(-1);
    };
    /**
     * Sets this matrix to the identity element for multiplication, 1.
     */
    Matrix2.prototype.one = function () {
        return this.set(1, 0, 0, 1);
    };
    /**
     * Sets this matrix to the transformation for a
     * reflection in the line normal to the unit vector <code>n</code>.
     *
     * this ⟼ reflection(<b>n</b>) = I - 2 * <b>n</b><sup>T</sup> * <b>n</b>
     *
     */
    Matrix2.prototype.reflection = function (n) {
        var nx = mustBeNumber_1.mustBeNumber('n.x', n.x);
        var xx = 1 - 2 * nx * nx;
        return this.set(xx, 0, 0, 1);
    };
    /**
     * Returns the row for the specified index.
     * @param i the zero-based index of the row.
     */
    Matrix2.prototype.row = function (i) {
        var te = this.elements;
        return [te[0 + i], te[2 + i]];
    };
    /**
     * Multiplies this matrix by the scale factor, α.
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
     * @method toExponential
     * @param [fractionDigits] {number}
     * @return {string}
     */
    Matrix2.prototype.toExponential = function (fractionDigits) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toExponential(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * @method toFixed
     * @param [fractionDigits] {number}
     * @return {string}
     */
    Matrix2.prototype.toFixed = function (fractionDigits) {
        if (isDefined_1.isDefined(fractionDigits)) {
            mustBeInteger_1.mustBeInteger('fractionDigits', fractionDigits);
        }
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toFixed(fractionDigits); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * @method toPrecision
     * @param [precision] {number}
     * @return {string}
     */
    Matrix2.prototype.toPrecision = function (precision) {
        if (isDefined_1.isDefined(precision)) {
            mustBeInteger_1.mustBeInteger('precision', precision);
        }
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toPrecision(precision); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * @method toString
     * @param [radix] {number}
     * @return {string}
     */
    Matrix2.prototype.toString = function (radix) {
        var text = [];
        for (var i = 0, iLength = this.dimensions; i < iLength; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toString(radix); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     * @method translation
     * @param d {VectorE1}
     * @return {Matrix2}
     * @chainable
     */
    Matrix2.prototype.translation = function (d) {
        var x = d.x;
        return this.set(1, x, 0, 1);
    };
    /**
     * Sets this matrix to the identity element for addition, 0.
     */
    Matrix2.prototype.zero = function () {
        return this.set(0, 0, 0, 0);
    };
    Matrix2.prototype.__add__ = function (rhs) {
        if (rhs instanceof Matrix2) {
            return Lockable_1.lock(this.clone().add(rhs));
        }
        else {
            return void 0;
        }
    };
    Matrix2.prototype.__radd__ = function (lhs) {
        if (lhs instanceof Matrix2) {
            return Lockable_1.lock(lhs.clone().add(this));
        }
        else {
            return void 0;
        }
    };
    Matrix2.prototype.__mul__ = function (rhs) {
        if (rhs instanceof Matrix2) {
            return Lockable_1.lock(this.clone().mul(rhs));
        }
        else if (typeof rhs === 'number') {
            return Lockable_1.lock(this.clone().scale(rhs));
        }
        else {
            return void 0;
        }
    };
    Matrix2.prototype.__rmul__ = function (lhs) {
        if (lhs instanceof Matrix2) {
            return Lockable_1.lock(lhs.clone().mul(this));
        }
        else if (typeof lhs === 'number') {
            return Lockable_1.lock(this.clone().scale(lhs));
        }
        else {
            return void 0;
        }
    };
    Matrix2.prototype.__pos__ = function () {
        return Lockable_1.lock(this.clone());
    };
    Matrix2.prototype.__neg__ = function () {
        return Lockable_1.lock(this.clone().scale(-1));
    };
    Matrix2.prototype.__sub__ = function (rhs) {
        if (rhs instanceof Matrix2) {
            return Lockable_1.lock(this.clone().sub(rhs));
        }
        else {
            return void 0;
        }
    };
    Matrix2.prototype.__rsub__ = function (lhs) {
        if (lhs instanceof Matrix2) {
            return Lockable_1.lock(lhs.clone().sub(this));
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Matrix2.reflection = function (n) {
        return Matrix2.zero.clone().reflection(n);
    };
    Matrix2.one = Lockable_1.lock(new Matrix2(new Float32Array([1, 0, 0, 1])));
    Matrix2.zero = Lockable_1.lock(new Matrix2(new Float32Array([0, 0, 0, 0])));
    return Matrix2;
}(AbstractMatrix_1.AbstractMatrix));
exports.Matrix2 = Matrix2;
